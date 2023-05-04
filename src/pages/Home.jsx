import { useEffect, useState } from 'react';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth, db } from '../index';
import { signOut } from 'firebase/auth';
import { AnimatePresence, LayoutGroup, motion, useAnimationControls } from 'framer-motion';
import { useAtom, useSetAtom } from 'jotai';
import { 
    pastSessionData, 
    appMode, 
    notificationText,
    currentSessionData,
    editingPrevious,
    pastEntryIndex,
    currentFormName,
    lizardLastEditTime
} from '../utils/jotai';
import { doc, getDoc } from 'firebase/firestore';
import Dropdown from '../components/Dropdown';
import Button from '../components/Button';
import { deleteLizardEntries } from '../utils/functions';

export default function Home() {
    const [user, loading, error] = useAuthState(auth);
    const [pastSessions] = useAtom(pastSessionData);
    const [environment, setEnvironment] = useAtom(appMode);
    const setNotification = useSetAtom(notificationText);
    const [currentData, setCurrentData] = useAtom(currentSessionData);
    const setIsEditingPrevious = useSetAtom(editingPrevious);
    const setPastEntryIndex = useSetAtom(pastEntryIndex);
    const [clearSessionConfirmationOpen, setClearSessionConfirmationOpen] = useState('')
    const setLastEditTime = useSetAtom(lizardLastEditTime);

    const clearCurrentSession = () => {
        setCurrentData({
            captureStatus: '',
            array: '',
            project: '',
            site: '',
            handler: '',
            recorder: '',
            arthropod: [],
            amphibian: [],
            lizard: [],
            mammal: [],
            snake: [],
        });
        deleteLizardEntries(currentData, setLastEditTime);
        setNotification('Current session cleared!')
        setClearSessionConfirmationOpen(false);
    }

    const clearSessionConfirmationVariant = {
        hidden: {
            y: '-100%',
            opacity: 0,
        },
        visible: {
            y: 0,
            opacity: 1
        },
        exit: {
            opacity: 0,
            y: '-100%',
            transition: {
                y: {
                    duration: .3
                },
                opacity: {
                    duration: .25
                }
            }
        }
    }

    return (
        <motion.div>
            <LayoutGroup>

            <motion.h1 className="text-xl">Hello, {user.email || 'Unknown person!'}!</motion.h1>
            <Button 
                prompt={"Logout"}
                clickHandler={() => signOut(auth)}
            />
            <Dropdown 
                placeholder={"App mode"}
                value={environment}
                setValue={setEnvironment}
                options={["test", "live"]}
                clickHandler={entry => {
                    setNotification(`App is now in ${entry} mode`)
                    setCurrentData({
                        captureStatus: '',
                        array: '',
                        project: '',
                        site: '',
                        handler: '',
                        recorder: '',
                        arthropod: [],
                        amphibian: [],
                        lizard: [],
                        mammal: [],
                        snake: [],
                    })
                    setIsEditingPrevious(false);
                    setPastEntryIndex(-1);
                }}
            />
            <Button 
                prompt='Clear current session data?'
                clickHandler={() => {
                    if (clearSessionConfirmationOpen) {
                        setClearSessionConfirmationOpen(false)
                    } else {
                        setClearSessionConfirmationOpen(true)
                    }
                }}
            />
            <AnimatePresence mode='popLayout'>
            {clearSessionConfirmationOpen && <motion.div
                variants={clearSessionConfirmationVariant}
                initial='hidden'
                animate='visible'
                exit='exit'
                className='flex flex-row items-center justify-around'
            >   
                <Button 
                    prompt='Yes'
                    clickHandler={() => clearCurrentSession()}
                />
                <Button 
                    prompt='No'
                    clickHandler={() => setClearSessionConfirmationOpen(false)}
                />
            </motion.div>}
            </AnimatePresence>
            <motion.p layout className="text-xl mt-4 font-bold underline mb-2">Daily summary:</motion.p>
            <motion.table layout className="rounded-xl table-auto border-collapse w-full">
                <thead>
                    <tr>
                        <th className="border-b border-r border-slate-500 w-1/4 p-2">Synced?</th>
                        <th className="border-b border-slate-500 p-2">Record</th>
                    </tr>
                </thead>
                <tbody>
                    {pastSessions.map((session) => {
                        const date = new Date(session.sessionData.sessionEpochTime);
                        const today = new Date();
                        if (date.getDate() === today.getDate()) {
                            return (
                                <tr key={session.sessionData.sessionEpochTime} >
                                    <td className="flex justify-center">
                                        {session.uploaded ? (
                                            <svg
                                                xmlns="http://www.w3.org/2000/svg"
                                                fill="none"
                                                viewBox="0 0 24 24"
                                                strokeWidth={1.5}
                                                stroke="currentColor"
                                                className="w-6 h-6 stroke-green-600"
                                            >
                                                <path
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                    d="M4.5 12.75l6 6 9-13.5"
                                                />
                                            </svg>
                                        ) : (
                                            <svg
                                                xmlns="http://www.w3.org/2000/svg"
                                                fill="none"
                                                viewBox="0 0 24 24"
                                                strokeWidth={1.5}
                                                stroke="currentColor"
                                                className="w-6 h-6 stroke-red-600"
                                            >
                                                <path
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                    d="M6 18L18 6M6 6l12 12"
                                                />
                                            </svg>
                                        )}
                                    </td>
                                    <td>
                                        {session.sessionData.site} @ {date.toLocaleTimeString()}
                                    </td>
                                </tr>
                            );
                        } else return null;
                    })}
                </tbody>
            </motion.table>
            </LayoutGroup>
        </motion.div>
    );
}
