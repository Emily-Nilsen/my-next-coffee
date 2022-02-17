import { useState, useEffect, useContext } from 'react';
import { ACTION_TYPES, StoreContext } from '../store/store-context';
import Head from 'next/head';
import Banner from '../components/banner';
import Card from '../components/card';

import { fetchCoffeeStores } from '../lib/coffee-stores';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faCoffee as fasFaCoffee,
  faFaceHandOverMouth,
  faPersonWalking,
} from '@fortawesome/pro-solid-svg-icons';

import useTrackLocation from '../hooks/use-track-location';

export async function getStaticProps(context) {
  const coffeeStores = await fetchCoffeeStores();
  return {
    props: { coffeeStores }, // will be passed to the page component as props
  };
}

export default function Home(props) {
  const { handleTrackLocation, locationErrorMsg, isFindingLocation } =
    useTrackLocation();

  const [coffeeStoresError, setCoffeeStoresError] = useState(null);

  const { dispatch, state } = useContext(StoreContext);

  const { coffeeStores, latLong } = state;

  useEffect(() => {
    const setCoffeeStoresByLocation = async () => {
      if (latLong) {
        try {
          const response = await fetch(
            `/api/getCoffeeStoresByLocation?latLong=${latLong}&limit=31`
          );
          const coffeeStores = await response.json();

          dispatch({
            type: ACTION_TYPES.SET_COFFEE_STORES,
            payload: { coffeeStores },
          });
          setCoffeeStoresError('');
        } catch (error) {
          //set error
          setCoffeeStoresError(error.message);
        }
      }
    };
    setCoffeeStoresByLocation();
  }, [latLong, dispatch]);

  const handleOnBannerBtnClick = () => {
    handleTrackLocation();
  };

  return (
    <div>
      <Head>
        <title>My Next Coffee</title>
        <meta
          name="description"
          content="Find coffee shops and cafés close to you!"
        />
      </Head>
      <main className="flex flex-col items-center justify-center pt-4 mx-auto bg-center bg-cover bg-coffee-green bg-coffee-pattern">
        <Banner
          buttonText={
            isFindingLocation ? (
              <>
                <FontAwesomeIcon icon={fasFaCoffee} spin />
              </>
            ) : (
              <>Find My Café</>
            )
          }
          handleOnClick={handleOnBannerBtnClick}
        />

        {locationErrorMsg && (
          <p className="text-xl text-coffee-100">
            <FontAwesomeIcon icon={faFaceHandOverMouth} beat />
            &nbsp; Oops! Something went wrong: <br /> {locationErrorMsg}
          </p>
        )}

        {coffeeStoresError && (
          <p className="text-xl text-coffee-100">
            <FontAwesomeIcon icon={faFaceHandOverMouth} beat />
            &nbsp; Oops! Something went wrong: <br /> {coffeeStoresError}
          </p>
        )}

        {/* Rendered list */}
        {coffeeStores.length > 0 && (
          <div className="container w-4/5 sm:w-full sm:px-4 md:px-14">
            <h1 className="py-2 text-4xl md:mt-14 text-coffee-100">
              Coffee shops near me
            </h1>
            <div className="container grid grid-cols-1 gap-10 py-6 mb-10 sm:grid-cols-2 lg:grid-cols-3 sm:w-full">
              {coffeeStores.map((coffeeStore) => {
                return (
                  <Card
                    key={coffeeStore.id}
                    name={coffeeStore.name}
                    neighbourhood={coffeeStore.neighbourhood}
                    distance={coffeeStore.distance}
                    imgUrl={
                      coffeeStore.imgUrl ||
                      'https://images.unsplash.com/photo-1504753793650-d4a2b783c15e?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=2000&q=80'
                    }
                    href={`/coffee-store/${coffeeStore.id}`}
                  />
                );
              })}
            </div>
          </div>
        )}

        {/* Static coffee shops */}
        {props.coffeeStores.length > 0 && (
          <div className="container w-4/5 sm:w-full sm:px-4 md:px-14">
            <h1 className="py-2 text-4xl text-coffee-100">Oslo City</h1>
            <div className="container grid grid-cols-1 gap-10 py-6 mb-10 sm:grid-cols-2 lg:grid-cols-3 sm:w-full">
              {props.coffeeStores.map((coffeeStore) => {
                return (
                  <Card
                    key={coffeeStore.id}
                    name={coffeeStore.name}
                    neighbourhood={coffeeStore.neighbourhood}
                    distance={coffeeStore.distance}
                    imgUrl={
                      coffeeStore.imgUrl ||
                      'https://images.unsplash.com/photo-1504753793650-d4a2b783c15e?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=2000&q=80'
                    }
                    href={`/coffee-store/${coffeeStore.id}`}
                  />
                );
              })}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
