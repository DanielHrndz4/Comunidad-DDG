export default function TableView({ fields, children }) {

    return (
        <div className="flex flex-wrap gap-16 justify-center p-32">
            {children}
        </div>
    );
}