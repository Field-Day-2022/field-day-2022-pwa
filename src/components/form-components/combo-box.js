import React from 'react';
import { Form, FormGroup, FormLabel } from 'react-bootstrap';

export default ({ prompt, onChange, options, disabled, defValue }) => (
    <FormGroup controlId={prompt}>
        <FormLabel className="select-group">
            <span>{prompt}</span>
            <Form.Control required as="select" custom onChange={onChange} disabled={disabled}>
                {
                    <option key="empty" className="list-item">
                        {' '}
                    </option>
                }
                {options.map((option) => {
                    return (
                        <option
                            key={option}
                            className="list-item"
                            selected={option === defValue}
                        >
                            {option}
                        </option>
                    );
                })}
            </Form.Control>
        </FormLabel>
    </FormGroup>
);