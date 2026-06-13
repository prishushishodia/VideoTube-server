const Loader = () => {
  return (
    <div className="flex justify-center items-center h-64">
      <div className="relative w-12 h-12">
        <div className="absolute w-full h-full border-4 border-red-500 border-t-transparent rounded-full animate-spin"></div>
        <div className="absolute inset-0 flex items-center justify-center text-sm text-red-500 font-semibold">
          Loading
        </div>
      </div>
    </div>
  );
};

export default Loader;
