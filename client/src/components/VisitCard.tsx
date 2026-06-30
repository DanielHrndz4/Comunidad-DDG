interface VisitItem {
  _id?: string;
  visitName: string;
  dui: string;
  numPlaca: string;
  visitHouse: number | string;
  date: string;
}

interface VisitCardProps {
  visit: VisitItem;
}

export default function VisitCard({
  visit,
}: VisitCardProps) {
  return (
    <article className="card-panel w-full">
      <div className="flex flex-col gap-4">
        <div>
          <h3 className="font-display text-lg font-bold text-white mb-3">
            {visit.visitName}
          </h3>
        </div>

        <div className="grid gap-2 sm:grid-cols-2">
          <p className="text-sm text-slate-400">
            <span className="font-semibold text-slate-200">DUI:</span> {visit.dui}
          </p>
          <p className="text-sm text-slate-400">
            <span className="font-semibold text-slate-200">Placa:</span> {visit.numPlaca}
          </p>
          <p className="text-sm text-slate-400">
            <span className="font-semibold text-slate-200">Casa:</span> {visit.visitHouse}
          </p>
          <p className="text-sm text-slate-400">
            <span className="font-semibold text-slate-200">Fecha:</span>{' '}
            {new Date(visit.date).toLocaleDateString()}
          </p>
        </div>
      </div>
    </article>
  );
}