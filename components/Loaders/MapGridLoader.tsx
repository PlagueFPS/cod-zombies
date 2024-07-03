
export default function MapGridLoader() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 items-center">
      {[...Array(8).keys()].map(i => (
        <div key={ i } className="h-[450px] w-[322px] bg-accent animate-pulse rounded-md" />
      ))}
    </div>
  )
}
