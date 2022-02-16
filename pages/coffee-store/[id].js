import { useContext, useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import Head from 'next/head';
import Image from 'next/image';

import useSWR from 'swr';

import { fetchCoffeeStores } from '../../lib/coffee-stores';
import { StoreContext } from '../../store/store-context';
import { fetcher, isEmpty } from '../../utils';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faCoffeeBeans,
  faCoffee as fasFaCoffee,
  faHeart as fasFaHeart,
} from '@fortawesome/pro-solid-svg-icons';
import {
  faArrowLeftLong,
  faPersonWalking,
  faHeart as farFaHeart,
} from '@fortawesome/pro-regular-svg-icons';

export async function getStaticProps(staticProps) {
  const params = staticProps.params;

  const coffeeStores = await fetchCoffeeStores();
  const findCoffeeStoreById = coffeeStores.find((coffeeStore) => {
    return coffeeStore.id.toString() === params.id;
  });

  return {
    props: {
      coffeeStore: findCoffeeStoreById ? findCoffeeStoreById : {},
    },
  };
}

export async function getStaticPaths() {
  const coffeeStores = await fetchCoffeeStores();
  const paths = coffeeStores.map((coffeeStore) => {
    return {
      params: { id: coffeeStore.id.toString() },
    };
  });
  return {
    paths,
    fallback: true,
  };
}

const CoffeeStore = (initialProps) => {
  const router = useRouter();

  const id = router.query.id;

  const [coffeeStore, setCoffeeStore] = useState(
    initialProps.coffeeStore || {}
  );

  const {
    state: { coffeeStores },
  } = useContext(StoreContext);

  const handleCreateCoffeeStore = async (coffeeStore) => {
    try {
      const { id, name, voting, distance, imgUrl, neighbourhood, address } =
        coffeeStore;
      const response = await fetch('/api/createCoffeeStore', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          id,
          name,
          voting: 0,
          distance,
          imgUrl,
          neighbourhood: neighbourhood || '',
          address: address || '',
        }),
      });

      const dbCoffeeStore = await response.json();
    } catch (err) {
      console.error('Error creating coffee shop', err);
    }
  };

  useEffect(() => {
    if (isEmpty(initialProps.coffeeStore)) {
      if (coffeeStores.length > 0) {
        const coffeeStoreFromContext = coffeeStores.find((coffeeStore) => {
          return coffeeStore.id.toString() === id;
        });

        if (coffeeStoreFromContext) {
          setCoffeeStore(coffeeStoreFromContext);
          handleCreateCoffeeStore(coffeeStoreFromContext);
        }
      }
    } else {
      handleCreateCoffeeStore(initialProps.coffeeStore);
    }
  }, [
    id,
    initialProps,
    initialProps.coffeeStore,
    coffeeStores,
    setCoffeeStore,
  ]);

  const {
    address = '',
    name = '',
    neighbourhood = '',
    distance = '',
    imgUrl = '',
  } = coffeeStore;

  const [votingCount, setVotingCount] = useState(0);

  const { data, error } = useSWR(`/api/getCoffeeStoreById?id=${id}`, fetcher, {
    refreshInterval: 2000,
    revalidateIfStale: true,
  });

  useEffect(() => {
    if (data && data.length > 0) {
      setCoffeeStore(data[0]);

      setVotingCount(data[0].voting);
    }
  }, [data, setCoffeeStore]);

  if (router.isFallback) {
    return <div>Loading...</div>;
  }

  const handleUpvoteButton = async () => {
    try {
      const response = await fetch('/api/favouriteCoffeeStoreById', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          id,
        }),
      });

      const dbCoffeeStore = await response.json();

      if (dbCoffeeStore && dbCoffeeStore.length > 0) {
        let count = votingCount + 1;
        setVotingCount(count);
      }
    } catch (err) {
      console.error('Error upvoting coffee shop', err);
    }
  };

  if (error) {
    return (
      <div className="container mx-auto text-center">
        <p>Something went wrong retrieving coffee shop page</p>
      </div>
    );
  }

  return (
    <div className="bg-center bg-cover bg-coffee-green bg-coffee-pattern">
      <Head>
        <title>{name}</title>
      </Head>

      <div className="container grid px-10 pt-10 pb-4 mx-auto sm:p-8 md:px-20 lg:w-1/2">
        <div className="w-1/2 mx-auto sm:pt-10">
          <Image
            src="/static/coffee-logo.svg"
            alt="My Next Coffee Logo"
            width={500}
            height={300}
            priority={true}
          />
        </div>

        <Link href="/">
          <a>
            <div className="mt-4 mb-10 text-xl font-normal transition duration-200 ease-in-out text-coffee-300 hover:text-white">
              <h2>
                <span>
                  <FontAwesomeIcon className="mr-2" icon={faArrowLeftLong} />
                </span>
                Go back{' '}
                <span>
                  <FontAwesomeIcon
                    className="pl-2 text-2xl "
                    icon={faCoffeeBeans}
                  />
                </span>
              </h2>
            </div>
          </a>
        </Link>

        <div className="container mx-auto sm:mb-10">
          <div className="grid w-full grid-cols-1 grid-rows-2 mb-10 overflow-hidden rounded-lg sm:grid-rows-1 sm:grid-cols-2 md:grid-cols-3 justify-items-stretch">
            <div className="relative w-full overflow-hidden sm:rounded-l-lg md:col-span-2">
              <Image
                src={
                  imgUrl ||
                  'https://images.unsplash.com/photo-1504753793650-d4a2b783c15e?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=2000&q=80'
                }
                alt={name}
                layout="fill"
                objectFit="cover"
                objectPosition="center"
              />
            </div>
            <div className="flex flex-col items-start justify-between p-8 bg-white rounded-b-lg sm:px-6 sm:rounded-none sm:rounded-r-lg">
              <div>
                <h1 className="mb-8 text-2xl text-coffee-green sm:mt-6">
                  {name}
                </h1>
              </div>
              <div className="flex flex-col mb-4 justify-evenly">
                <h2 className="pb-2 font-normal text-coffee-600">
                  {neighbourhood}
                </h2>
                <p className="font-light text-coffee-600">{address}</p>
                <div className="flex flex-col pt-8">
                  <div>
                    <p className="pb-4 text-lg font-normal text-coffee-600">
                      <FontAwesomeIcon
                        className="mr-2"
                        icon={faPersonWalking}
                      />
                      {((Math.log(coffeeStore.distance) * Math.LOG10E + 1) |
                        0) >
                      3
                        ? (distance / 1000).toFixed(1) + ' km'
                        : distance + ' m'}
                    </p>
                  </div>
                  <div className="text-lg font-normal text-coffee-600 ">
                    <p>
                      <FontAwesomeIcon className="mr-2" icon={fasFaCoffee} />
                      {votingCount}
                    </p>
                  </div>
                </div>

                <button
                  onClick={handleUpvoteButton}
                  className="px-6 py-3 mt-8 transition duration-200 ease-in-out rounded-full bg-coffee-50 text-coffee-600 hover:text-coffee-50 hover:bg-coffee-600 min-w-min"
                >
                  <p>
                    <span className="text-red-400">
                      <FontAwesomeIcon className="mr-2" icon={fasFaHeart} />
                    </span>
                    Café
                  </p>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CoffeeStore;
