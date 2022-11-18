import { useState } from 'react';
import { useAtom } from 'jotai'

import NumberInput from '../components/NumberInput';
import Dropdown from '../components/Dropdown';
import FormWrapper from '../components/FormWrapper';
import SingleCheckbox from '../components/SingleCheckbox';
import TextInput from './TextInput';
import Button from '../components/Button';

import { currentFormName, currentSessionData } from '../utils/jotai';

import { updateData } from '../utils/functions';

import { 
  arthropodSpeciesList as species, 
  arthropodFenceTraps as fenceTraps
} from '../utils/hardCodedData';

export default function NewArthropodEntry() {
  const [trap, setTrap] = useState();
  const [predator, setPredator] = useState(false);
  const [arthropodData, setArthropodData] = useState();

  const [currentData, setCurrentData] = useAtom(currentSessionData)
  const [currentForm, setCurrentForm] = useAtom(currentFormName);

  const completeCapture = () => {
    updateData(
      'arthropod',
      {
        trap,
        predator,
        arthropodData
      },
      setCurrentData,
      currentData,
      setCurrentForm
    )
  }

  return (
    <FormWrapper>
      <Dropdown 
        value={trap}
        setValue={setTrap}
        placeholder="Fence Trap"
        options={fenceTraps}
      />
      <SingleCheckbox 
        prompt="Predator?"
        value={predator}
        setValue={setPredator}
      />
      {species.map((item) => (
        <NumberInput
          key={item}
          label={item}
          placeholder='# of critters'
          setValue={(value) =>
            setArthropodData({ ...arthropodData, [item]: value })
          }
        />
      ))}
      <TextInput 
        prompt="Comments"
        placeholder="any thoughts?"
        value={arthropodData?.comments ?? '' }
        setValue={
          value => setArthropodData({
            ...arthropodData,
            "comments": value
          })
        }
      />
      <Button 
        prompt="Finished?"
        clickHandler={completeCapture}
      />
    </FormWrapper>
  );
}
