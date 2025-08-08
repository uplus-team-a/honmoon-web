import React from "react";
import raffleItems from "features/common/data/raffleItems";

type Props = {
  params: { id: string };
};

export default async function RaffleDetailPage(props: Promise<Props>) {
  const { params } = await props;
  const { id } = await params;

  // TODO: Fetch raffle item data based on the ID from an API or data source
  const raffleItem = raffleItems.find((item) => item.id === id);

  if (!raffleItem) {
    return (
      <div className="max-w-screen-lg mx-auto p-4">
        <h1 className="text-2xl font-bold mb-4">Raffle Item Not Found</h1>
        <p className="text-gray-700">
          The requested raffle item could not be found.
        </p>
      </div>
    );
  }

  return (
    <div className="max-w-screen-lg mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">{raffleItem.title}</h1>
      <img
        src={raffleItem.imageUrl}
        alt={raffleItem.title}
        className="w-64 mb-4"
      />
      <p className="text-gray-700">{raffleItem.description}</p>
      <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mt-4">
        응모하기
      </button>
    </div>
  );
}
