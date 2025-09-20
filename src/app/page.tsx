import { prisma } from "@/lib/db";


const Page = async() => {

  const post = await prisma.post.findMany()
  return (
    <div>
      <h1>Hello Baby</h1>
    </div>
  );
};

export default Page;
