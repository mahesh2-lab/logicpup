import { redirect } from "next/navigation";

// Next 15 page params are promises
export default async function ProjectIndexPage(
  props: { params: Promise<{ projectId: string }> }
) {
  const params = await props.params;
  redirect(`/projects/${params.projectId}/editor`);
}
