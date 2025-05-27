//import FriendList from "./FriendList";
import { useState } from "react";
import type { Friend, ButtonProps, AddFriendFormProps } from "./types";
import "./index.css";

const initialFriends: Friend[] = [
  {
    id: 1,
    name: "Alice Johnson",
    image: "https://i.pravatar.cc/150?u=alice",
    balance: 0,
  },
  {
    id: 2,
    name: "Bob Smith",
    image: "https://i.pravatar.cc/150?u=bob",
    balance: -7,
  },
  {
    id: 3,
    name: "Charlie Rose",
    image: "https://i.pravatar.cc/150?u=charlie",
    balance: 14,
  },
];
function Button({ children, onClick }: ButtonProps) {
  return (
    <button
      onClick={onClick}
      className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition"
    >
      {children}
    </button>
  );
}

function App() {
  const [friends, setFriends] = useState(initialFriends);
  const [showAddFriend, setShowAddFriend] = useState(false);
  const [selectedFriend, setSelectedFriend] = useState<Friend | null>(null);

  function handleShowAddFriend() {
    setShowAddFriend((show) => !show);
  }

  function handleAddFriend(friend: Friend) {
    setFriends((friends) => [...friends, friend]);
    setShowAddFriend(false);
  }

  function handleSplitBill(value: number, payer: "user" | "friend") {
    if (!selectedFriend) return;
    setFriends((friends) =>
      friends.map((friend) =>
        friend.id === selectedFriend.id
          ? {
              ...friend,
              balance:
                payer === "user"
                  ? friend.balance + value
                  : friend.balance - value,
            }
          : friend
      )
    );
    setSelectedFriend(null);
  }

  function handleSelection(friend: Friend) {
    setSelectedFriend((cur) => (cur?.id === friend.id ? null : friend));
    setShowAddFriend(false);
  }

  return (
    <div className="p-8 max-w-xl mx-auto bg-white shadow-md rounded">
      <h1 className="text-2xl font-bold mb-4">💰 SplitNeat</h1>

      <FriendList
        friends={friends}
        selectedFriend={selectedFriend}
        onSelection={handleSelection}
      />

      {showAddFriend && <AddFriendForm onAddFriend={handleAddFriend} />}

      <Button onClick={handleShowAddFriend}>
        {showAddFriend ? "Close" : "➕ Add Friend"}
      </Button>

      <SplitBillForm
        selectedFriend={selectedFriend}
        onSplitBill={handleSplitBill}
      />
    </div>
  );
  /*components/
│   │   ├── FriendList.tsx
│   │   ├── AddFriendForm.tsx
│   │   └── SplitBillForm.tsx*/
}

export default App;

function FriendList({
  friends,
  selectedFriend,
  onSelection,
}: {
  friends: Friend[];
  selectedFriend: Friend | null;
  onSelection: (friend: Friend) => void;
}) {
  //const friends = initialFriends;
  return (
    <div>
      <ul>
        {friends.map((friend) => {
          return (
            <Friend
              friend={friend}
              key={friend.id}
              selectedFriend={selectedFriend}
              onSelection={onSelection}
            />
          );
        })}
      </ul>
    </div>
  );
}
function Friend({
  friend,
  selectedFriend,
  onSelection,
}: {
  friend: Friend;
  selectedFriend: Friend | null;
  onSelection: (friend: Friend) => void;
}) {
  const isSelected = selectedFriend?.id === friend.id;
  return (
    <li className={`p-4 rounded ${isSelected ? "bg-blue-100" : ""}`}>
      <div className="flex items-center justify-between border-b py-4 ">
        <div className="flex items-center gap-4">
          <img
            className="w-14 h-14 rounded-full"
            src={friend.image}
            alt={friend.name}
          />
          <div>
            <h3 className="font-semibold text-lg">{friend.name}</h3>
            {friend.balance < 0 && (
              <p className="text-red-500">
                You owe {friend.name} ${Math.abs(friend.balance)}
              </p>
            )}
            {friend.balance > 0 && (
              <p className="text-green-600">
                {friend.name} owes you ${Math.abs(friend.balance)}
              </p>
            )}
            {friend.balance === 0 && (
              <p className="text-gray-500">You and {friend.name} are even</p>
            )}
          </div>
        </div>
        <Button onClick={() => onSelection(friend)}>
          {isSelected ? "Deselect" : "Select"}
        </Button>
      </div>
    </li>
  );
}

function AddFriendForm({ onAddFriend }: AddFriendFormProps) {
  const [name, setName] = useState("");
  const [image, setImage] = useState("");
  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    if (!name || !image) return;

    const id = Math.floor(Math.random() * 10000);
    const newFriend = { id, name, image: `${image}?=${id}`, balance: 0 };
    onAddFriend(newFriend);
    setName("");
    setImage("");
  }
  return (
    <form
      onSubmit={handleSubmit}
      className="bg-gray-100 p-4 mt-4 rounded shadow"
    >
      <label className="block mb-2 font-medium">Friend Name</label>
      <input
        type="text"
        value={name}
        onChange={(e) => setName(e.target.value)}
        className="w-full p-2 mb-4 border rounded"
      />
      <label className="block mb-2 font-medium">Image URL</label>
      <input
        type="text"
        value={image}
        onChange={(e) => setImage(e.target.value)}
        className="w-full p-2 mb-4 border rounded"
      />
      <Button>Add Friend</Button>
    </form>
  );
}

function SplitBillForm({
  selectedFriend,
  onSplitBill,
}: {
  selectedFriend: Friend | null;
  onSplitBill: (value: number, payer: "user" | "friend") => void;
}) {
  const [bill, setBill] = useState("");
  const [paidByUser, setPaidByUser] = useState("");
  const [payer, setPayer] = useState<"user" | "friend">("user");

  if (!selectedFriend) return null;

  const paidByFriend = bill && paidByUser ? +bill - +paidByUser : "";

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    const billValue = Number(bill);
    const userExpense = Number(paidByUser);

    if (!bill || !paidByUser || userExpense > billValue) return;
    const amount = payer === "user" ? billValue - userExpense : userExpense;

    onSplitBill(amount, payer);

    // Reset form
    setBill("");
    setPaidByUser("");
    setPayer("user");
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-gray-100 p-4 mt-6 rounded shadow space-y-4"
    >
      <h2 className="text-xl font-semibold text-gray-800">
        Split a bill with{" "}
        <span className="text-blue-600">{selectedFriend.name}</span>
      </h2>

      <div>
        <label className="block mb-1 font-medium text-gray-700">
          Bill value
        </label>
        <input
          type="number"
          value={bill}
          onChange={(e) => setBill(e.target.value)}
          className="w-full p-2 border border-gray-300 rounded"
        />
      </div>

      <div>
        <label className="block mb-1 font-medium text-gray-700">
          Your expense
        </label>
        <input
          type="number"
          value={paidByUser}
          onChange={(e) => setPaidByUser(e.target.value)}
          className="w-full p-2 border border-gray-300 rounded"
        />
      </div>

      <div>
        <label className="block mb-1 font-medium text-gray-700">
          {selectedFriend.name}'s expense
        </label>
        <input
          type="number"
          value={paidByFriend}
          disabled
          className="w-full p-2 border border-gray-300 bg-gray-200 rounded"
        />
      </div>

      <div>
        <label className="block mb-1 font-medium text-gray-700">
          Who paid the bill?
        </label>
        <select
          value={payer}
          onChange={(e) => setPayer(e.target.value as "user" | "friend")}
          className="w-full p-2 border border-gray-300 rounded"
        >
          <option value="user">You</option>
          <option value="friend">{selectedFriend.name}</option>
        </select>
      </div>

      <Button>Split Bill</Button>
    </form>
  );
}
