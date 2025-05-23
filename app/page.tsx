import { getPosts } from "@/actions/post.action";
import { getDbUserId } from "@/actions/user.action";
import CreatePost from "@/components/CreatePost";
import PostCard from "@/components/PostCard";
import WhoToFollow from "@/components/WhoToFollow";
import { currentUser } from "@clerk/nextjs/server";

export default async function Home() {

  const user = await currentUser();
  const { posts } = await getPosts();
  const dbUserId: any = await getDbUserId() ?? null




  return (
    <div className="grid grid-cols-1 lg:grid-cols-10 gap-6">
      <div className="lg:col-span-6">
        {
          user ?

            <CreatePost /> : null
        }
        <div className="space-y-6">
          {posts ? posts.map((post: any) => (<PostCard key={post.id} dbUserId={dbUserId} post={post} />)) : <h3>No Posts To Show</h3>}
        </div>
      </div>
      <div className=" hidden lg:block lg:col-span-4 sticky top-20">

        <WhoToFollow />
      </div>
    </div>
  );
}
