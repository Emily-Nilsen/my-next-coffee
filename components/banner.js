import Image from 'next/image';

const Banner = (props) => {
  return (
    <div className="flex flex-col items-center justify-between flex-1 h-full mx-10 mb-12 md:pr-6 md:m-0">
      <Image
        src="/static/coffee-logo.svg"
        alt="My Next Coffee Logo"
        width={500}
        height={300}
        priority={true}
      />
      <h1 className="w-5/6 mt-6 text-2xl tracking-wide text-center text-coffee-300 xl:mt-10 sm:w-full">
        Discover your local coffee shops!
      </h1>
      <button
        onClick={props.handleOnClick}
        className="py-3 text-xl tracking-wide transition duration-200 ease-in-out rounded-full bg-coffee-50 px-7 text-coffee-600 hover:bg-white hover:text-coffee-green xl:mt-24 mt-14"
      >
        {props.buttonText}
      </button>
    </div>
  );
};

export default Banner;
