export default function UserProfilePage() {
  return (
    <div>
      <h1 className="text-3xl font-semibold">Profile</h1>
      <form className="mt-6 max-w-xl rounded-lg border border-zinc-200 bg-white p-5">
        <label className="block text-sm font-medium text-zinc-800">
          Preferred role
          <input
            className="mt-2 h-11 w-full rounded-md border border-zinc-300 px-3 outline-none focus:border-teal-700"
            placeholder="Software Engineer"
          />
        </label>
        <label className="mt-4 block text-sm font-medium text-zinc-800">
          Skills
          <input
            className="mt-2 h-11 w-full rounded-md border border-zinc-300 px-3 outline-none focus:border-teal-700"
            placeholder="React, Node.js, SQL"
          />
        </label>
      </form>
    </div>
  );
}
