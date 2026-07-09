import { createUploadthing, type FileRouter } from "uploadthing/next";
import { UploadThingError } from "uploadthing/server";
import { requireOrganization } from "@/lib/auth";

const f = createUploadthing();

export const ourFileRouter = {
  receiptUploader: f({ image: { maxFileSize: "4MB" }, pdf: { maxFileSize: "8MB" } })
    .middleware(async ({ req }) => {
      const { user, organization } = await requireOrganization();
      if (!user) throw new UploadThingError("Unauthorized");
      return { userId: user.id, organizationId: organization.id };
    })
    .onUploadComplete(async ({ metadata, file }) => {
      console.log("Upload complete for userId:", metadata.userId);
      console.log("file url", file.url);
      return { uploadedBy: metadata.userId, url: file.url };
    }),
} satisfies FileRouter;

export type OurFileRouter = typeof ourFileRouter;
