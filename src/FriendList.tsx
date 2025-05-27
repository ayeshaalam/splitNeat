import type { Friend } from "./types";

export default function FriendList({ friends }: { friends: Friend[] }) {
  //const friends = initialFriends;
  return (
    <div>
      <ul>return {friends.map((friend) => {

    return(
        <Friend friend={friend} key={friend.id}/>);
  })}
      </ul>
    </div>
  );
}
function Friend({friend}){
  return {friend.map((friend) => {
    (<li>{friend.name}</li>);
  })}
}