import React, { useState, useEffect } from 'react';
import "./ManageMembers.css"
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import { queryUsersByEmail } from "../../backendConnection/AuthService";
import userRed from "../../assets/user_red.png"
import { deleteMember } from "../../backendConnection/MemberService"
import { addNewMember } from "../../backendConnection/MemberService";
import { thisBoardMembers } from '../../backendConnection/MemberService';

function ManageMembers({ show, onHide, userInfo, boardId, boardMembers, updateBoardMembers, isAdmin}) {
const [name, setName] = useState('');
  const [members, setMembers] = useState('');
  const [memberSuggestions, setMemberSuggestions] = useState([]);
  const [addedMembers, setAddedMembers] = useState([]);
  const [memberError, setMemberError] = useState('');
  const [debounceTimeout, setDebounceTimeout] = useState(null);
  const [memberBeingConfirmed, setMemberBeingConfirmed] = useState(null);
  const [addError, setAddError] = useState('');
  
  const handleMemberInputChange = (e) => {
    const email = e.target.value;
    setMembers(email);
    setMemberError('');
    setAddError(''); 
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
    const isAddedMember = addedMembers.some(addedMember => addedMember.email === member.email);
    const isBoardMember = boardMembers.some(boardMember => boardMember.email === member.email);
    return isAddedMember || isBoardMember;
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
const renderAddedMembers = (showRemoveButton = true) => {
    return addedMembers.map((member, index) => (
        <div key={index} className="added-member">
            {member.firstName} {member.lastName}
            {showRemoveButton && member._id !== userInfo._id && (
                <Button 
                    variant="outline-danger" 
                    size="sm" 
                    className="remove-member-button" 
                    onClick={() => handleRemoveAddedMember(index)}
                >
                    &#x2716;
                </Button>
            )}
        </div>
    ));
};
const renderBoardMembers = (showRemoveButton = true) => {
  return boardMembers.map((member, index) => (
    <div key={index} className="board-member">
      <img src={userRed} className="userRedBoardMembers"></img>
      {member.firstName} {member.lastName}
      {isAdmin && showRemoveButton && member._id !== userInfo._id && (
        <>
          {memberBeingConfirmed === member._id ? (
            <span className="confirmDeleteMemberMessage">
              Are you sure?
              <Button variant="outline-danger" size="sm" className="confirmDeleteMember" onClick={() => confirmRemoveMember(member._id)}>
                Yes
              </Button>
              <Button variant="outline-secondary" size="sm" className="cancelDeleteMember"onClick={() => setMemberBeingConfirmed(null)}>
                No
              </Button>
            </span>
          ) : (
            <Button 
              variant="outline-danger" 
              size="sm" 
              className="remove-member-button" 
              onClick={() => setMemberBeingConfirmed(member._id)}
            >
              &#x2716;
            </Button>
          )}
        </>
      )}
    </div>
  ));
};

const confirmRemoveMember = async (memberId) => {
  try {
    await deleteMember(boardId, memberId); // Make sure boardId is passed as prop
    updateBoardMembers(prevMembers => prevMembers.filter(member => member._id !== memberId));
    setMemberBeingConfirmed(null);
  } catch (error) {
    console.error("Error removing member:", error);
  }
};

  const handleRemoveAddedMember = (indexToRemove) => {
    setAddedMembers(addedMembers.filter((_, index) => index !== indexToRemove));
  };
  useEffect(() => {
    if (show && userInfo) {
      setAddedMembers([]);
    }
  }, [show, userInfo]);

  const handleSubmit = async () => {
    if (addedMembers.length === 0) {
      setAddError('List of members to add is currently empty. If you want to add new members, do so using the search bar above.');
      return; 
    }
  
    try {
      const addMemberPromises = addedMembers.map(member => addNewMember(boardId, member._id));
      const addedMembersDetails = await Promise.all(addMemberPromises);
  
      // Assuming the API returns the details of the added member
      thisBoardMembers(boardId)
      .then((members) => {
        updateBoardMembers(members); 
      })
      .catch((error) => {
        console.error("Error fetching users:", error);
      });
  
      onHide();
    } catch (error) {
      console.error("Error adding new members:", error);
    }
  };

  const handleModalClose = () => {
    onHide(); 
    setAddError('');
  };


  return (
    <Modal show={show} onHide={handleModalClose}>
      <Modal.Header closeButton className="headerModal">
        <Modal.Title className="titleModal">Members</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <form>
          <div className="form-group">
            <label>This Board's Members:</label>
            <div className="boardMembersList">
              {renderBoardMembers()}
            </div>
          </div>
          {isAdmin && (
            <div>
              <div className="form-group">
                <label>Add New Members</label>
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
                {addError && (
                  <div className="addError-message">
                    <span>{addError}</span>
                  </div>
                )}
              </div>
              <Modal.Footer className="footerModal">
                <Button variant="danger" onClick={handleSubmit} className="addUsersBtn">
                  Add Members
                </Button>
              </Modal.Footer>
            </div>
          )}
        </form>
      </Modal.Body>
    </Modal>
  );
  }

export default ManageMembers;