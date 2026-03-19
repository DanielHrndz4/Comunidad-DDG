export default function TableCard({ children }) {
    return (
        <div className="w-300 p-20 bg-light-blue border border-solid border-pastel-blue rounded-[10px]
        text-dark-gray text-center duration-300 ease-in-out shadow-md
        hover:-translate-y-5 hover:shadow-lg">
            {children}
        </div>
    )
};