import React, { useContext, Fragment, useEffect } from "react";
import { CSSTransition, TransitionGroup } from "react-transition-group";
import ContactItem from "./ContactItem";
import ContactContext from "../../context/contact/contactContext";
import ProgressIndicator from "../layouts/Spinner"

const Contacts = () => {
  const contactContext = useContext(ContactContext);
  const {
    contacts,
    filtered,
    getContacts,
    loading,
  } = contactContext;
  

  useEffect(() => {
    getContacts();
    
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  console.log(contacts)
  if (contacts !== null && contacts.length === 0 && !loading) {
    return <h4>Please add a contact</h4>; // if contact list is empty
  }

  return (
    <Fragment>
      {contacts !== null && !loading ? (<TransitionGroup>
        {filtered !== null
          ? filtered.map((
              contact // updates the contact list based on filter control
            ) => (
              <CSSTransition key={contact._id} timeout={500} classNames="item">
                <ContactItem contact={contact} />
              </CSSTransition>
            ))
          : contacts.map((
              contact // shows full contact list
            ) => (
              <CSSTransition key={contact._id} timeout={500} classNames="item">
                <ContactItem contact={contact} />
              </CSSTransition>
            ))}
      </TransitionGroup>) : <ProgressIndicator />}
      
    </Fragment>
  );
};

export default Contacts;
