export default function LoadingPage() {
  // You can add any UI inside Loading, including a Skeleton.
  return (
    <div className='flex flex-col w-ful h-full justify-center items-center'>
      <span className='loading loading-spinner loading-lg'></span>
      <p className='mt-4 text-3xl'>Loading...</p>
    </div>
  );
}
