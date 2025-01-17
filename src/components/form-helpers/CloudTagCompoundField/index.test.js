import { fireEvent, render, screen, waitForElementToBeRemoved } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import { Formik, Form } from 'formik';
import { CloudTagCompoundField } from '.';
import IntlProvider from '../../../i18n/DopplerIntlProvider.double-with-ids-as-values';

const matchTags = (cloudTags, currentTags, labelKey) => {
  currentTags.forEach((obj, index) => expect(cloudTags[index]).toHaveTextContent(obj[labelKey]));
};

const FieldArrayError = ({ errors, fieldName }) => {
  let errorMessage = errors?.[fieldName];

  return errorMessage ? (
    <div className="wrapper-errors dp-message dp-error-form" role="alert">
      <p>{errorMessage}</p>
    </div>
  ) : null;
};

describe('CloudTagCompoundField component', () => {
  it('should add a tag when the add button is clicked and show error if it already exists', async () => {
    // Arrange
    const labelKey = 'name';
    const fieldName = 'subscribers';
    const tagToAdd = { id: 1, [labelKey]: 'subscriber_x' };
    const initialValues = [
      { id: 1, [labelKey]: 'subscriber_1' },
      { id: 2, [labelKey]: 'subscriber_2' },
    ];
    const max = 4;
    const buttonText = 'add list';
    const onSubmit = jest.fn();

    const WrapperComponent = ({ handleSubmit }) => {
      const onSubmit = (values) => handleSubmit(values);

      return (
        <IntlProvider>
          <Formik
            initialValues={{ [fieldName]: initialValues }}
            enableReinitialize={true}
            onSubmit={onSubmit}
          >
            {({ errors }) => (
              <Form>
                <CloudTagCompoundField
                  fieldName={fieldName}
                  labelKey={labelKey}
                  max={max}
                  render={(addTag) => (
                    <button
                      type="button"
                      className="dp-button dp-add-list"
                      onClick={() => addTag(tagToAdd)}
                    >
                      {buttonText}
                    </button>
                  )}
                />
                <FieldArrayError errors={errors} fieldName={fieldName} />
                <button type="submit">Save</button>
              </Form>
            )}
          </Formik>
        </IntlProvider>
      );
    };

    // Act
    render(<WrapperComponent handleSubmit={onSubmit} />);

    // Assert
    const addButton = screen.getByRole('button', { name: buttonText });
    expect(addButton).toBeInTheDocument();

    const initialTags = screen.queryAllByRole('listitem');
    // initialTags.length-1 because the add button is in a listitem
    expect(initialTags.length - 1).toBe(initialValues.length);
    matchTags(initialTags, initialValues, labelKey);

    // simulate add tag
    await fireEvent.click(addButton);
    expect(await screen.findByText(tagToAdd[labelKey])).toBeInTheDocument();
    let addedTags = screen.queryAllByRole('listitem');
    // initialValues.length+1 because the tag was added
    expect(addedTags.length - 1).toBe(initialValues.length + 1);

    // simulate add tag (fail because tag already exist)
    await fireEvent.click(addButton);
    addedTags = screen.queryAllByRole('listitem');
    const errors = screen.getByRole('alert');
    expect(errors).toBeInTheDocument();
    expect(screen.getByText('cloud_tags.tag_already_exist')).toBeInTheDocument();
    // the tag was not added. The number of tags is maintained
    expect(addedTags.length - 1).toBe(initialValues.length + 1);

    // simulate submit form
    const submitButton = screen.getByRole('button', { name: 'Save' });
    await fireEvent.click(submitButton);

    await waitForElementToBeRemoved(screen.getByRole('alert'));

    expect(onSubmit).toHaveBeenCalledTimes(1);
    expect(onSubmit).toHaveBeenCalledWith({
      [fieldName]: [...initialValues, tagToAdd], // because only one tag was added
    });
  });
});
