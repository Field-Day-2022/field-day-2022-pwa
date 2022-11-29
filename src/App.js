import { collection } from 'firebase/firestore'
import { useCollection, useCollectionData } from 'react-firebase-hooks/firestore'
import CollectData from "./pages/CollectData";
import { db } from './index';
import { useAtom } from 'jotai';
import { currentFormName, currentPageName } from './utils/jotai';
import Home from './pages/Home';
import PastSessionData from './pages/PastSessionData';
import Navbar from './components/Navbar';
import { motion } from 'framer-motion'

function App() {

  const [ currentPage, setCurrentPage ] = useAtom(currentPageName)
  const [ currentForm, setCurrentForm ] = useAtom(currentFormName)

  const [
    answerSet,
    answerSetLoading, 
    answerSetError, 
    answerSetSnapshot, 
  ] = useCollectionData(collection(db, 'AnswerSet'))

  const [
    toeCodeSnapshot,
    toeCodeLoading,
    toeCodeError
  ] = useCollection(collection(db, 'ToeClipCodes'))

  const [
    testtoeCodeSnapshot,
    testtoeCodeLoading,
    testtoeCodeError
  ] = useCollection(collection(db, 'TestToeClipCodes'))

  if (answerSetSnapshot) console.log(`Retrieved answer set from ${answerSetSnapshot?.metadata.fromCache ? 'cache' : 'server'}`)
  if (toeCodeSnapshot) console.log(`Retrieved live toe codes from ${toeCodeSnapshot?.metadata.fromCache ? 'cache' : 'server'}`)
  if (testtoeCodeSnapshot) console.log(`Retrieved test toe codes from ${testtoeCodeSnapshot?.metadata.fromCache ? 'cache' : 'server'}`)

  if (answerSetError || toeCodeError || testtoeCodeError) {
    return (
      <h1>Error</h1>
    )
  }

  if (answerSetLoading || toeCodeLoading || testtoeCodeLoading) {
    return (
      <h1>Loading data...</h1>
    )
  }
  
  return (
    <motion.div className="
      font-openSans 
      overflow-hidden 
      absolute 
      flex 
      flex-col 
      items-center 
      text-center 
      justify-start 
      inset-0 
      bg-gradient-to-tr 
      from-asu-maroon 
      to-asu-gold
      "
    >
      <motion.div className="
        flex 
        flex-col 
        overflow-visible 
        items-center 
        h-full
        w-full 
        pr-0 
        bg-gradient-to-r 
        from-slate-300/25 
        rounded-lg
        text-asu-maroon
        "
      >
        <Navbar />
        <div className='divider mb-0 pb-0 mt-0 h-1 bg-asu-gold/75' />
        {currentPage === 'Home' && <Home />}
        {currentPage === 'History' && <PastSessionData />}
        {currentPage === 'Collect Data' && <CollectData />}
      </motion.div>
    </motion.div>
  );
}

export default App;
