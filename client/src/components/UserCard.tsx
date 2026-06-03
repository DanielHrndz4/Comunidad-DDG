import "./UserCard.css";

interface UserItem {
  name: string;
  email: string;
}

interface UserCardProps {
  usr: UserItem;
}

export default function UserCard({
  usr,
}: UserCardProps) {
  return (
    <div className="cards-container">
      <div className="card-user">
        <h2
          style={{ textAlign: "center" }}
          className="text-[1.5rem] text-dark-gray font-bold"
        >
          {usr.name}
        </h2>

        <p
          style={{ textAlign: "center" }}
          className="text-[1rem] text-light-gray font-bold"
        >
          {usr.email}
        </p>
      </div>
    </div>
  );
}