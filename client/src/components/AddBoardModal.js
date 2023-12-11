import "./AddBoardModal.css";
import React, { useState, useEffect } from 'react';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import { Link } from "react-router-dom";
import { queryUsersByEmail } from "../backendConnection/AuthService";
import userRed from "../assets/user_red.png"

function AddBoardModal({ show, onHide, onSubmit, userInfo }) {
  const [name, setName] = useState('');
  const [members, setMembers] = useState('');
  const [memberSuggestions, setMemberSuggestions] = useState([]);
  const [addedMembers, setAddedMembers] = useState([]);
  const [memberError, setMemberError] = useState('');
  const [debounceTimeout, setDebounceTimeout] = useState(null);

  const handleMemberInputChange = (e) => {
    const email = e.target.value;
    setMembers(email);
    setMemberError('');
    setMemberSuggestions([]);

    if (debounceTimeout) {
      clearTimeout(debounceTimeout);
    }

    setDebounceTimeout(setTimeout(async () => {
      if (email.length > 0) {
        const suggestions = await queryUsersByEmail(email);
        if (suggestions.length > 0) {
          setMemberSuggestions(suggestions);
        } else {
          setMemberError('No user found...');
        }
      }
    }, 1000)); 
  };

  useEffect(() => {
    return () => {
      if (debounceTimeout) {
        clearTimeout(debounceTimeout);
      }
    };
  }, [debounceTimeout]);

  const handleSelectSuggestion = (suggestedMember) => {
    if (isMemberAdded(suggestedMember)) {
      console.log('Member already added');
      return;
    }
    setAddedMembers([...addedMembers, suggestedMember]);
    setMembers('');
    setMemberSuggestions([]);
  };
  
  const handleMemberInputKeyPress = (e) => {
    if (e.key === 'Enter' && memberSuggestions.length > 0) {
      handleSelectSuggestion(memberSuggestions[0]);
    }
  };

  const isMemberAdded = (member) => {
    return addedMembers.some(addedMember => addedMember.email === member.email);
  };
  
  const renderMemberSuggestions = () => {
    return memberSuggestions.map((suggestion, index) => (
      <Button
        key={index}
        onClick={() => handleSelectSuggestion(suggestion)}
        variant="outline-primary"
        className="member-suggestion-button"
        disabled={isMemberAdded(suggestion)}
      >
        <img src={userRed} className="userRed"></img>
        {suggestion.firstName} {suggestion.lastName}
      </Button>
    ));
  };
  const renderAddedMembers = () => {
    return addedMembers.map((member, index) => (
      <div key={index} className="added-member">
        {member.firstName} {member.lastName}
        {member._id !== userInfo._id && (
          <Button 
            variant="outline-danger" 
            size="sm" 
            className="remove-member-button" 
            onClick={() => handleRemoveMember(index)}
          >
            &#x2716;
          </Button>
        )}
      </div>
    ));
  };
  const handleRemoveMember = (indexToRemove) => {
    setAddedMembers(addedMembers.filter((_, index) => index !== indexToRemove));
  };
  useEffect(() => {
    if (show && userInfo) {
      setAddedMembers([userInfo]);
    }
  }, [show, userInfo]);

  const handleSubmit = () => {
    const boardData = {
      name: name,
      admins: userInfo._id,
      members: addedMembers.map(member => member._id)
    };
    onSubmit(boardData);
    onHide();
  };


  return (
    <Modal show={show} onHide={onHide}>
      <Modal.Header closeButton className="headerModal">
        <Modal.Title className="titleModal">Create a New Board</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <form>
          <div className="form-group">
            <label>Name</label>
            <input
              type="text"
              className="form-control"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>
          <div className="form-group">
            <label>Admin</label>
            {/* Display current user's name/email as the admin */}
            <div className="adminName"><p>{userInfo.firstName} {userInfo.lastName}</p></div>
          </div>
          <div className="form-group">
            <label>Members</label>
            <input
              type="text"
              className="form-control memberInput"
              value={members}
              onChange={handleMemberInputChange}
              onKeyPress={handleMemberInputKeyPress}
            />
            <div className="member-suggestions">
              {renderMemberSuggestions()}
            </div>
            {memberError && (
              <div className="member-error"><span>{memberError}</span></div>
            )} 
            <div className="added-members-list">
              {renderAddedMembers()}
            </div>
          </div>
        </form>
      </Modal.Body>
      <Modal.Footer className="footerModal">
          <Button variant="danger" onClick={handleSubmit} className="submitBoard">
            Create Board
          </Button>
      </Modal.Footer>
    </Modal>
  );
}

export default AddBoardModal;