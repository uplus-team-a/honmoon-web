import React from "react";
import {
  fetchRaffleProductById,
  applyRaffle,
} from "../../../services/raffleService";

type PageParams = Promise<{ id: string }>;

export default async function Page({ params }: { params: PageParams }) {
  const { id } = await params;
  const raffleItem = await fetchRaffleProductById(id).catch(() => null);

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
      <h1 className="text-2xl font-bold mb-4">{raffleItem.name}</h1>
      <img
        src={raffleItem.imageUrl || "https://via.placeholder.com/320x240"}
        alt={raffleItem.name}
        className="w-64 mb-4"
      />
      <p className="text-gray-700">{raffleItem.description}</p>
      <form
        action={async () => {
          "use server";
          await applyRaffle(id);
        }}
      >
        <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mt-4">
          응모하기
        </button>
      </form>
    </div>
  );
}
