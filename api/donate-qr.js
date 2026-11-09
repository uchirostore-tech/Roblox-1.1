import https from 'node:https';

const KHPAY_API_KEY = process.env.KHPAY_API_KEY || 'ak_af41446eb45fd448fae8ed7555c785830246ab2edbac45b8';

function getRequestBody(req) {
  if (req.body) {
    return Promise.resolve(typeof req.body === 'string' ? JSON.parse(req.body) : req.body);
  }
  return new Promise((resolve) => {
    let body = '';
    req.on('data', chunk => body += chunk.toString());
    req.on('end', () => {
      try { resolve(JSON.parse(body || '{}')); } catch (e) { resolve({}); }
    });
  });
}

// Fallback Bakong CRC16 generator for offline/direct ABA payment
function calculateKHQR_CRC16(str) {
  let crc = 0xFFFF;
  for (let i = 0; i < str.length; i++) {
    crc ^= (str.charCodeAt(i) << 8);
    for (let j = 0; j < 8; j++) {
      if ((crc & 0x8000) !== 0) {
        crc = ((crc << 1) ^ 0x1021) & 0xFFFF;
      } else {
        crc = (crc << 1) & 0xFFFF;
      }
    }
  }
  return crc.toString(16).toUpperCase().padStart(4, '0');
}

export function generateDirectUchiroKHQR(amount) {
  const amtStr = parseFloat(amount).toFixed(2);
  const tag54 = `54${String(amtStr.length).padStart(2, '0')}${amtStr}`;
  const basePayload = "00020101021230510016abaakhppxxx@abaa01151260328140807200208ABA Bank520453995303840" +
    tag54 +
    "5802KH5920KHIN SOVANNOREAKYOUT6003BMC62220118PAYWAY@ABA-UCHIRO6304";
  const crc = calculateKHQR_CRC16(basePayload);
  return {
    transaction_id: `txn_direct_${Date.now()}`,
    qr_string: basePayload + crc,
    expires_in: 300,
    payment_url: "https://t.me/uchirostore"
  };
}

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    if (res.status) return res.status(204).end();
    res.writeHead(204);
    return res.end();
  }

  try {
    const payload = await getRequestBody(req);
    let amount = parseFloat(payload.amount);
    if (isNaN(amount) || amount <= 0) amount = 1.00;
    const formattedAmount = amount.toFixed(2);
    const note = payload.note || 'Donation to @uchirostore by @noreakyout';

    const postObj = {
      amount: formattedAmount,
      currency: 'USD',
      note: note
    };
    if (payload.success_url) postObj.success_url = payload.success_url;
    if (payload.cancel_url) postObj.cancel_url = payload.cancel_url;

    const postData = JSON.stringify(postObj);

    const options = {
      hostname: 'khpay.site',
      port: 443,
      path: '/api/v1/qr/generate',
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${KHPAY_API_KEY}`,
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(postData)
      },
      timeout: 10000
    };

    const khpayReq = https.request(options, (khpayRes) => {
      let data = '';
      khpayRes.on('data', chunk => data += chunk);
      khpayRes.on('end', () => {
        try {
          const parsed = JSON.parse(data);
          if (parsed && parsed.success && parsed.data) {
            if (res.status) return res.status(khpayRes.statusCode).json(parsed);
            res.writeHead(khpayRes.statusCode, { 'Content-Type': 'application/json' });
            return res.end(data);
          }
          // If KHPAY returned error or inactive, fallback to direct Bakong KHQR
          const fallback = generateDirectUchiroKHQR(amount);
          const out = { success: true, data: fallback, fallback: true };
          if (res.status) return res.status(200).json(out);
          res.writeHead(200, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify(out));
        } catch (e) {
          const fallback = generateDirectUchiroKHQR(amount);
          const out = { success: true, data: fallback, fallback: true };
          if (res.status) return res.status(200).json(out);
          res.writeHead(200, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify(out));
        }
      });
    });

    khpayReq.on('error', (err) => {
      // Fallback on network timeout or DNS error
      const fallback = generateDirectUchiroKHQR(amount);
      const out = { success: true, data: fallback, fallback: true, networkError: err.message };
      if (res.status) return res.status(200).json(out);
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify(out));
    });

    khpayReq.write(postData);
    khpayReq.end();
  } catch (err) {
    const fallback = generateDirectUchiroKHQR(1.00);
    const out = { success: true, data: fallback, fallback: true, error: err.message };
    if (res.status) return res.status(200).json(out);
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify(out));
  }
}
