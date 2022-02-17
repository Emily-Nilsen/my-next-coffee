import Image from 'next/image';
import Link from 'next/link';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { faPersonWalking } from '@fortawesome/pro-regular-svg-icons';

const Card = (props) => {
  const distanceToCafe = (Math.log(props.distance) * Math.LOG10E + 1) | 0;
  return (
    <Link href={props.href}>
      <a>
        <div className="overflow-hidden transition-transform duration-200 ease-in-out rounded-lg hover:scale-110">
          <Image
            src={props.imgUrl}
            alt={props.name}
            width={260}
            height={160}
            layout="responsive"
            objectFit="cover"
            objectPosition="center"
          />

          <div className="flex flex-col items-start justify-between p-6 bg-white sm:p-4">
            <h1 className="text-xl text-coffee-green line-clamp-1">
              {props.name}
            </h1>
            <p className="mt-1 text-coffee-600">{props.neighbourhood || ''}</p>
            <div className="flex justify-between w-full pt-3 pr-3">
              <div>
                <p className="pb-1 text-base font-normal text-coffee-600">
                  <FontAwesomeIcon className="mr-2" icon={faPersonWalking} />
                  {distanceToCafe > 3
                    ? (props.distance / 1000).toFixed(1) + ' km'
                    : props.distance + ' m'}
                </p>
              </div>
            </div>
          </div>
        </div>
      </a>
    </Link>
  );
};

export default Card;
