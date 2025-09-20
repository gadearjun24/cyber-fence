const User = require("../model/User");

// GET all users (with pagination, search, filters)
exports.getUsers = async (req, res) => {
  try {
    const { page = 1, limit = 10, search = "", role, status } = req.query;

    const query = {
      ...(search && {
        $or: [
          { username: { $regex: search, $options: "i" } },
          { email: { $regex: search, $options: "i" } },
        ],
      }),
      ...(role && { role }),
      ...(status && { isSuspended: status === "suspended" }),
    };
      console.log(query);

    const users = await User.find(query)
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(Number(limit));

    const total = await User.countDocuments(query);

    res.json({
      users,
      total,
      page: Number(page),
      totalPages: Math.ceil(total / limit),
    });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

// PATCH user (update role, suspend, etc.)
exports.updateUser = async (req, res) => {
  try {
    const { id } = req.params;
    const { role, suspend } = req.body;

    const user = await User.findById(id);
    if (!user) return res.status(404).json({ message: "User not found" });

    if (role) user.role = role;
    if (suspend !== undefined) user.isSuspended = suspend;

    await user.save();
    res.json({ message: "User updated", user });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

// DELETE user
exports.deleteUser = async (req, res) => {
  try {
    const { id } = req.params;
    await User.findByIdAndDelete(id);
    res.json({ message: "User deleted" });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};
