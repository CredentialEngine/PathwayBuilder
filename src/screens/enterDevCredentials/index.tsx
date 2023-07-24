import { Form } from 'antd';
import React, { useEffect, useState } from 'react';

import InputBox from '../../components/formFields/inputBox';

import { enterDevCredentialsTexts } from './constants';
import styles from './index.module.scss';

interface Props {
  visible?: boolean;
  getEnteredDevCreds?: (value: string) => void;
}

const EnterDevCredentials: React.FC<Props> = ({ getEnteredDevCreds }) => {
  const [enteredCreds, setEnteredCreds] = useState('');

  const handleChange = (event: {
    target: { value: React.SetStateAction<string> };
  }) => {
    setEnteredCreds(event.target.value);
  };

  useEffect(() => {
    if (enteredCreds) {
      getEnteredDevCreds && getEnteredDevCreds(enteredCreds);
    }
  }, [enteredCreds]);

  return (
    <div className={styles.enterDevCredentialsWrapper}>
      <Form>
        <div>
          <p className={styles.heading}>{enterDevCredentialsTexts.heading}</p>
          <div className={styles.textboxLabel}>
            <span>{enterDevCredentialsTexts.textboxLabel}</span>
            <InputBox
              name="DevCredentials"
              required={true}
              onChange={handleChange}
            />
          </div>
        </div>
      </Form>
    </div>
  );
};

export default EnterDevCredentials;
