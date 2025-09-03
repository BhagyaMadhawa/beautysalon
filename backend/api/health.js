export default (_req, res) => {
  res.status(200).json({ ok: true, source: 'standalone function' });
};
