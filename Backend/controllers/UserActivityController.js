
const User = require("../models/User");
const UserActivity = require("../models/UserActivity");



// ---------------------- get Activity ---------------
//get activity
const getActivity = async (req, res) => {
  try {
    const { uid } = req.params;

    const existingUser = await User.findById(uid);
    if (!existingUser) {
      return res.status(404).json({ message: "User not found" });
    }

    const activities = await UserActivity.find({ uid }).sort({ date: -1 });


    const formattedActivities = activities.map((act) => ({
      id: act._id,
      type: act.type,
      description: act.description,
      date: act.date,
    }));

    return res.status(200).json(formattedActivities);
  } catch (error) {
    return res.status(500).json({ message: "Server Error" });
  }
}


// ---------------------- get Activity End ---------------



// ---------------------- Logout ---------------
const loggedOutAcivity = async(req, res)=> {
    console.log("Logout activity called");
    try {
    const { uid } = req.params;

    const existingUser = await User.findById(uid);
    if (!existingUser) {
      return res.status(404).json({ message: "User not found" });
    }

    const newData = new UserActivity({
        uid: uid,
        type: "login",
        description: "Logged Out"
    })
    await newData.save()

    await User.findByIdAndUpdate(uid, { lastLogout: new Date() }, { new: true });


    return res.status(200).json({message: "Activity added"})
  } catch (error) {
    return res.status(500).json({ message: "Server Error" });
  }
}

// ---------------------- Logout End ---------------




module.exports = {
    getActivity,
    loggedOutAcivity
};
