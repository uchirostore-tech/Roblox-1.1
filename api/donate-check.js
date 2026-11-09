import https from 'node:https';

const KHPAY_API_KEY = process.env.KHPAY_API_KEY || 'ak_af41446eb45fd448fae8ed7555c785830246ab2edbac45b8';

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    if (res.status) return res.status(204).end();
    res.writeHead(204);
    return res.end();
  }

  try {
    const parsedUrl = new URL(req.url, 'http://localhost');
    const txnId = parsedUrl.searchParams.get('id') || parsedUrl.searchParams.get('transaction_id') || (req.query && req.query.id);

    if (!txnId) {
      const errRes = JSON.stringify({ success: false, error: 'Transaction ID is required' });
      if (res.status) return res.status(400).send(errRes);
      res.writeHead(400, { 'Content-Type': 'application/json' });
      return res.end(errRes);
    }

    // Direct offline simulation handling
    if (txnId.startsWith('txn_direct_') || txnId.startsWith('txn_offline_')) {
      const resp = JSON.stringify({ success: true, data: { paid: false, status: 'waiting' } });
      if (res.status) return res.status(200).send(resp);
      res.writeHead(200, { 'Content-Type': 'application/json' });
      return res.end(resp);
    }

    const options = {
      hostname: 'khpay.site',
      port: 443,
      path: `/api/v1/qr/check/${encodeURIComponent(txnId)}`,
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${KHPAY_API_KEY}`,
        'Content-Type': 'application/json'
      },
      timeout: 8000
    };

    const khpayReq = https.request(options, (khpayRes) => {
      let data = '';
      khpayRes.on('data', chunk => data += chunk);
      khpayRes.on('end', () => {
        try {
          const parsed = JSON.parse(data);
          if (res.status) return res.status(khpayRes.statusCode).json(parsed);
          res.writeHead(khpayRes.statusCode, { 'Content-Type': 'application/json' });
          res.end(data);
        } catch (e) {
          if (res.status) return res.status(500).json({ success: false, error: 'Invalid response from KHPAY' });
          res.writeHead(500, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ success: false, error: 'Invalid response from KHPAY' }));
        }
      });
    });

    khpayReq.on('error', (err) => {
      if (res.status) return res.status(500).json({ success: false, error: err.message });
      res.writeHead(500, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ success: false, error: err.message }));
    });

    khpayReq.end();
  } catch (err) {
    if (res.status) return res.status(500).json({ success: false, error: err.message });
    res.writeHead(500, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ success: false, error: err.message }));
  }
}
