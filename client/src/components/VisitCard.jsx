export default function VisitCard({visit}) {
    return(
        <div>
            <div>
                <h3>Nombre del visitante: {visit.visitName}</h3>
                <p>DUI: {visit.dui}</p>
                <p>Numero de placa: {visit.numPlaca}</p>
                <p>Casa a visitar: {visit.visitHouse}</p>
                <p>{visit.date}</p>
            </div>
        </div>
    )
};