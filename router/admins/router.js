import { Router } from "express";
import {
  addAdmin,
  adminLogIn,
  removeAdmin,
  manageAccess,
} from "../../controllers/admins/auth.js";
import {
  getAdminProfile,
  editAdminProfile,
  deleteAdminProfile,
  changeAdminAvatar,
  getAllAdmin,
} from "../../controllers/admins/admin.js";
import { authenticateAdmin, memoryUpload } from "../../util/util.js";
import {
  createCourse,
  deleteCourse,
  editCourse,
  getAllCourse,
  getAllCourseByCategory,
  publishCourse,
  searchAllCourses,
  unpublishCourse,
  uploadCourseVideoUrl,
} from "../../controllers/admins/courses.js";
import {
  getReports,
  getReportsById,
} from "../../controllers/admins/reports.js";
import {
  createTopic,
  deleteTopic,
  editTopic,
  uploadTopicVideoUrl,
} from "../../controllers/admins/topic.js";
import { handleUpload } from "@vercel/blob/client";
import { del } from "@vercel/blob";
import Topic from "../../models/Topic.js";
import Course from "../../models/Course.js";

/**
 * Admin router
 */
const router = Router();

/* admin routes */
// admin auth routes
router.post("/auth/login", adminLogIn);
router.post("/auth/addAdmin", authenticateAdmin, addAdmin);
router.patch("/auth/manageAccess/:adminId", authenticateAdmin, manageAccess);
router.delete("/auth/removeAdmin/:adminId", authenticateAdmin, removeAdmin);

// admin profile
router.get("/me", authenticateAdmin, getAdminProfile);
router.patch("/me", authenticateAdmin, editAdminProfile);
router.delete("/me", authenticateAdmin, deleteAdminProfile);
router.patch(
  "/admin/changeAvatar",
  authenticateAdmin,
  memoryUpload.single("avatar"),
  changeAdminAvatar
);
router.get("/all", authenticateAdmin, getAllAdmin);

// admin courses route
router.post(
  "/courses/create",
  authenticateAdmin,
  memoryUpload.single("thumbnail"),
  createCourse
);

router.post(
  "/course/:courseId/uploadUrl",
  authenticateAdmin,
  uploadCourseVideoUrl
);

router.get("/courses", authenticateAdmin, getAllCourse);
router.get("/courses/search", authenticateAdmin, searchAllCourses);
router.get(
  "/courses/category/:category",
  authenticateAdmin,
  getAllCourseByCategory
);

router.post("/courses/:courseId/topics/add", authenticateAdmin, createTopic);

router.post(
  "/courses/topics/:topicId/uploadUrl",
  authenticateAdmin,
  uploadTopicVideoUrl
);

router.patch(
  "/courses/:courseId",
  authenticateAdmin,
  memoryUpload.single("thumbnail"),
  editCourse
);

router.patch("/courses/topics/:topicId", authenticateAdmin, editTopic);

router.delete("/courses/:courseId", authenticateAdmin, deleteCourse);

router.delete("/courses/topics/:topicId", authenticateAdmin, deleteTopic);

router.patch("/courses/:courseId/publish", authenticateAdmin, publishCourse);

router.patch(
  "/courses/:courseId/unpublish",
  authenticateAdmin,
  unpublishCourse
);

// reports endpoint
router.get("/reports", authenticateAdmin, getReports);
router.get("/reports/:reportId", authenticateAdmin, getReportsById);

router.post("/handleUpload", async (req, res) => {
  const { body } = req;

  try {
    const jsonResponse = await handleUpload({
      body,
      request: req,
      onBeforeGenerateToken: async (pathname, clientPayload) => {
        return {
          allowedContentTypes: ["video/*"],
          tokenPayload: clientPayload,
        };
      },
      onUploadCompleted: async ({ blob, tokenPayload }) => {
        try {
          let { topicId } = JSON.parse(tokenPayload);
          console.log(topicId, tokenPayload);
          if (topicId) {
            let topic = await Topic.findByPk(topicId);
            console.log(topic);
            if (topic.video) await del(topic.video);
            console.log(blob);
            await topic.update({ video: blob.url });
          }
        } catch (error) {
          throw new Error("Could not update topic");
        }
      },
    });

    res.json(jsonResponse);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});
export default router;
