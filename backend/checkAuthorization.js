
const checkAuthorization = (req, res, next) => {
  // ตรวจสอบว่าผู้ใช้เป็นติดตามหรือไม่

  if (req.user && req.user.isFollower) {
    // ผู้ใช้เป็นติดตาม ดำเนินการต่อไป
    next();
  } else {
    // ผู้ใช้ไม่มีสิทธิ์เข้าถึง
    res.send({ status: 'error', message: "คุณไม่มีสิทธิ์ในการเข้าถึง" });
    res.status(403).json({ message: "คุณไม่มีสิทธิ์ในการเข้าถึง" });
  }
};

module.exports = checkAuthorization;

