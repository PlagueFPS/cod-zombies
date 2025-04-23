import Breadcrumbs from "../Breadcrumbs/Breadcrumbs"
import QuestFilterLoader from "./QuestFilterLoader";
import GridSection from "../GridSection/GridSection";
import GridLoader from "./GridLoader";
import GridPaginationLoader from "./GridPaginationLoader";

export default function SideQuestsPageLoader() {
  const links: { title: string, href: string }[] = [
    { title: 'Side Quests', href: `/side-quests` },
  ]

  return (
    <div className="flex flex-col justify-center items-center w-full">
      <div className='container flex flex-col gap-10 justify-center items-center'>
        <Breadcrumbs links={ links } />
        <GridSection title="Side Quests">
          <p className="text-lg text-muted-foreground -mt-7 mb-2">
            Discover the hidden secrets and rewards beyond the main story.
          </p>
          <QuestFilterLoader />  
          <GridLoader />
          <GridPaginationLoader pages={ 5 } />
        </GridSection>
      </div>
    </div>
  )
}
