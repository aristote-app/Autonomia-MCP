import HistoricalArchive from "./HistoricalArchive.js";
import {buildHistoricalGrowthArchive} from "../../../lib/intelligence/historicalGrowthArchive.js";
export const dynamic="force-dynamic";
export const metadata={title:"Historique des contacts · AUTONOMIA Growth",robots:{index:false,follow:false}};
export default function HistoricalArchivePage(){
  return <HistoricalArchive archive={buildHistoricalGrowthArchive()}/>;
}
