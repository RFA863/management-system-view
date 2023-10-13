import { Loading } from "@nextui-org/react";

const LoadingScreen = () => {
  return (
    <div className="absolute top-0 left-0 z-[9999] w-screen h-screen bg-neutral-800">
			<div className="w-full h-full flex justify-center items-center">
      	<Loading size="xl" />
			</div>
    </div>
  );
};

export default LoadingScreen;
