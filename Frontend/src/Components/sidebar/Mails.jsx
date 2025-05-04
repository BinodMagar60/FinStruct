import { useState, useEffect, useCallback } from "react";
import MailList from "./mailcomponents/mail-list";
import ComposeModal from "./mailcomponents/compose-modal";
import {
  receiveMailApi,
  receiveMailUsersApi,
  sendMailApi,
} from "../../api/AdminApi";
import Loading from "./Loading";

export default function MailPage() {
  const locallySavedUser = JSON.parse(localStorage.getItem("userDetails"));

  const [isComposeOpen, setIsComposeOpen] = useState(false);
  const [mails, setMails] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isChanging, setChanging] = useState(false);

  useEffect(() => {
    const loadData = async () => {
      try {
        const response = await receiveMailApi(
          `admin/user/mails/data?uid=${locallySavedUser.id}&cid=${locallySavedUser.companyId}`
        );

        const userResponse = await receiveMailUsersApi(
          `admin/user/mailUsers/data?uid=${locallySavedUser.id}&cid=${locallySavedUser.companyId}`
        );
        // console.log(response)
        setMails(response);
        setUsers(userResponse);
      } catch (error) {
        console.error("Failed to load data:", error);
      } finally {
        setTimeout(() => {
          setLoading(false);
        }, 200);
      }
    };

    loadData();
  }, [isChanging]);

  const sendMail = async (mail) => {
    try {
      const response = await sendMailApi(
        `admin/user/mails/data?uid=${locallySavedUser.id}&cid=${locallySavedUser.companyId}`,
        mail
      );
      console.log(response);
      setChanging((prev) => !prev);
    } catch (err) {
      console.log(err);
    }
  };

  const markAsRead = useCallback((id) => {
    setMails((prevMails) =>
      prevMails.map((mail) => {
        if (mail.id === id) {
          return { ...mail, isRead: true };
        }
        return mail;
      })
    );
  }, []);

  const deleteMail = useCallback((id) => {
    setMails((prevMails) => prevMails.filter((mail) => mail.id !== id));
  }, []);

  return (
    <div className="p-6">
      <div className="container mx-auto p-4 bg-white pb-8 rounded">
        {loading ? (
          <Loading />
        ) : (
          <>
            <h1 className="text-2xl font-bold mb-6">Mails</h1>

            <MailList
              mails={mails}
              markAsRead={markAsRead}
              deleteMail={deleteMail}
            />

            {isComposeOpen && (
              <ComposeModal
                onClose={() => setIsComposeOpen(false)}
                sendMail={sendMail}
                users={users}
                // currentUser={currentUser}
              />
            )}

            <button
              onClick={() => setIsComposeOpen(true)}
              className="fixed bottom-6 right-6 bg-black text-white rounded-full w-14 h-14 flex items-center justify-center shadow-lg hover:bg-gray-800 transition-colors"
              aria-label="Compose new mail"
            >
              <span className="text-2xl">+</span>
            </button>
          </>
        )}
      </div>
    </div>
  );
}
