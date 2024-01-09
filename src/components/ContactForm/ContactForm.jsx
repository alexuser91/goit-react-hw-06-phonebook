import { Formik, Field, Form, ErrorMessage } from 'formik';
import { object, string } from 'yup';
import { nanoid } from '@reduxjs/toolkit';
import { useSelector, useDispatch } from 'react-redux';
import { addContact } from '../redux/contactsSlice';
import { getContacts } from '../redux/selectors';
import toast from 'react-hot-toast';
import css from './ContactForm.module.css';

const regexName = /^[a-zA-Zа-яА-Я]+(([' -][a-zA-Zа-яА-Я ])?[a-zA-Zа-яА-Я]*)*$/;
const regexNumber =
  /\+?\d{1,4}?[-.\s]?\(?\d{1,3}?\)?[-.\s]?\d{1,4}[-.\s]?\d{1,4}[-.\s]?\d{1,9}/;

const schema = object({
  name: string()
    .matches(regexName, 'Name is not valid')
    .min(2, 'Name too short')
    .max(20, 'Name too long')
    .trim()
    .required('Name is required'),
  number: string()
    .matches(regexNumber, 'Phone number is not valid')
    .min(5, 'Phone number too short')
    .max(15, 'Phone number too long')
    .trim()
    .required('Phone number is required'),
});

export const ContactForm = () => {
  const contacts = useSelector(getContacts);
  const dispatch = useDispatch();

  const initialValues = {
    name: '',
    number: '',
  };

  const generetedId = () => {
    return nanoid(5);
  };

  const formSubmitHandler = data => {
    if (contacts.some(contact => contact.name === data.name)) {
      toast.error(`${data.name} is already in contacts.`);
      return;
    }
    dispatch(
      addContact({ id: generetedId(), name: data.name, number: data.number })
    );
  };

  const handleSubmit = (values, { resetForm }) => {
    formSubmitHandler(values);
    resetForm();
  };

  return (
    <Formik
      initialValues={initialValues}
      onSubmit={handleSubmit}
      validationSchema={schema}
    >
      <Form className={css.form_wrapper}>
        <label className={css.label}>
          Name
          <Field
            className={css.input}
            name="name"
            // pattern="^[a-zA-Zа-яА-Я]+(([' \-][a-zA-Zа-яА-Я ])?[a-zA-Zа-яА-Я]*)*$"
            title="Name may contain only letters, apostrophe, dash and spaces. For example Adrian, Jacob Mercer, Charles de Batz de Castelmore d'Artagnan"
          />
          <ErrorMessage
            component="div"
            className={css.error_name}
            name="name"
          />
        </label>
        <label className={css.label}>
          Number
          <Field
            className={css.input}
            name="number"
            // pattern="\+?\d{1,4}?[ .\-\s]?\(?\d{1,3}?\)?[ .\-\s]?\d{1,4}[ .\-\s]?\d{1,4}[ .\-\s]?\d{1,9}"
            title="Phone number must be digits and can contain spaces, dashes, parentheses and can start with +"
          />
        </label>
        <ErrorMessage
          component="div"
          className={css.error_number}
          name="number"
        />
        <button className={css.button_add} type="submit">
          Add contact
        </button>
      </Form>
    </Formik>
  );
};
