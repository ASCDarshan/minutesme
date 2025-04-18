import React, { useState, useEffect } from "react";
import { useMeeting } from "../../context/MeetingContext";
import { useNavigate } from "react-router-dom";
import { FaSpinner, FaFilePdf, FaFileAlt, FaSave } from "react-icons/fa";

const MinutesGenerator = () => {
  const { audioBlob, processMeeting, minutes, transcription, loading, error } =
    useMeeting();

  const [meetingTitle, setMeetingTitle] = useState("");
  const [processingStep, setProcessingStep] = useState("");
  const [processingTimeout, setProcessingTimeout] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (loading) {
      if (transcription && !minutes) {
        setProcessingStep("generating");
      }

      const timeout = setTimeout(() => {
        setProcessingStep((prev) =>
          prev === "transcribing" ? "generating" : "transcribing"
        );
      }, 8000);

      setProcessingTimeout(timeout);
      return () => clearTimeout(timeout);
    } else {
      if (processingTimeout) {
        clearTimeout(processingTimeout);
      }
    }
  }, [loading, transcription, minutes, processingTimeout]);

  const handleGenerateMinutes = async () => {
    if (!audioBlob) {
      return;
    }

    setProcessingStep("transcribing");
    const meetingId = await processMeeting(meetingTitle || "Untitled Meeting");

    if (meetingId) {
      navigate(`/meeting/${meetingId}`);
    }
  };

  const renderProcessingSteps = () => {
    if (loading) {
      return (
        <div className="flex flex-col items-center justify-center p-6 bg-white rounded-lg shadow-md">
          <FaSpinner className="text-primary text-4xl animate-spin mb-4" />
          <h3 className="text-lg font-semibold mb-2">
            {processingStep === "transcribing"
              ? "Transcribing your meeting..."
              : "Generating meeting minutes..."}
          </h3>
          <p className="text-gray-500 text-center">
            {processingStep === "transcribing"
              ? "Converting audio to text. This may take a few minutes for longer recordings."
              : "Our AI is organizing your meeting into structured minutes."}
          </p>
        </div>
      );
    }

    if (error) {
      return (
        <div className="p-4 bg-red-50 text-red-700 rounded-lg">
          <h3 className="font-semibold mb-2">Error</h3>
          <p>{error}</p>
        </div>
      );
    }

    return null;
  };

  return (
    <div className="w-full max-w-2xl mx-auto">
      {!minutes && !loading && (
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-bold mb-4">Generate Meeting Minutes</h2>

          {audioBlob ? (
            <>
              <div className="mb-4">
                <label
                  htmlFor="meetingTitle"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Meeting Title
                </label>
                <input
                  type="text"
                  id="meetingTitle"
                  value={meetingTitle}
                  onChange={(e) => setMeetingTitle(e.target.value)}
                  placeholder="Enter a title for your meeting"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                />
              </div>

              <button
                onClick={handleGenerateMinutes}
                disabled={loading}
                className="w-full flex items-center justify-center py-2 px-4 bg-primary hover:bg-primary-dark text-white font-medium rounded-md transition-colors focus:outline-none focus:ring-2 focus:ring-primary-light"
              >
                {loading ? (
                  <>
                    <FaSpinner className="animate-spin mr-2" />
                    Processing...
                  </>
                ) : (
                  <>
                    <FaFileAlt className="mr-2" />
                    Generate Minutes
                  </>
                )}
              </button>

              <p className="mt-2 text-sm text-gray-500">
                This will analyze your recording and create structured meeting
                minutes.
              </p>
            </>
          ) : (
            <p className="text-center text-gray-500">
              No recording available. Please record a meeting first.
            </p>
          )}
        </div>
      )}

      {renderProcessingSteps()}

      {minutes && !loading && (
        <div className="bg-white rounded-lg shadow-md p-6 mt-4">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold">
              {minutes.title || "Meeting Minutes"}
            </h2>
            <div className="flex space-x-2">
              <button
                className="flex items-center text-gray-600 hover:text-primary px-2 py-1 rounded border border-gray-300 hover:border-primary text-sm transition-colors"
                title="Download as PDF"
              >
                <FaFilePdf className="mr-1" /> PDF
              </button>
              <button
                className="flex items-center text-gray-600 hover:text-primary px-2 py-1 rounded border border-gray-300 hover:border-primary text-sm transition-colors"
                title="Download as Text"
              >
                <FaFileAlt className="mr-1" /> Text
              </button>
            </div>
          </div>

          {minutes.date && (
            <div className="mb-4">
              <h3 className="text-sm font-medium text-gray-500">
                Date and Time
              </h3>
              <p>{minutes.date}</p>
            </div>
          )}

          {minutes.participants && (
            <div className="mb-4">
              <h3 className="text-sm font-medium text-gray-500">
                Participants
              </h3>
              <p>{minutes.participants}</p>
            </div>
          )}

          {minutes.agenda && (
            <div className="mb-4">
              <h3 className="text-sm font-medium text-gray-500">Agenda</h3>
              <div
                dangerouslySetInnerHTML={{
                  __html: minutes.agenda.replace(/\n/g, "<br/>"),
                }}
              />
            </div>
          )}

          {minutes.keyPoints && (
            <div className="mb-4">
              <h3 className="text-sm font-medium text-gray-500">
                Key Discussion Points
              </h3>
              <div
                dangerouslySetInnerHTML={{
                  __html: minutes.keyPoints.replace(/\n/g, "<br/>"),
                }}
              />
            </div>
          )}

          {minutes.decisions && (
            <div className="mb-4">
              <h3 className="text-sm font-medium text-gray-500">Decisions</h3>
              <div
                dangerouslySetInnerHTML={{
                  __html: minutes.decisions.replace(/\n/g, "<br/>"),
                }}
              />
            </div>
          )}

          {minutes.actionItems && (
            <div className="mb-4">
              <h3 className="text-sm font-medium text-gray-500">
                Action Items
              </h3>
              <div
                dangerouslySetInnerHTML={{
                  __html: minutes.actionItems.replace(/\n/g, "<br/>"),
                }}
              />
            </div>
          )}

          {minutes.nextSteps && (
            <div className="mb-4">
              <h3 className="text-sm font-medium text-gray-500">Next Steps</h3>
              <div
                dangerouslySetInnerHTML={{
                  __html: minutes.nextSteps.replace(/\n/g, "<br/>"),
                }}
              />
            </div>
          )}

          {minutes.followUp && (
            <div className="mb-4">
              <h3 className="text-sm font-medium text-gray-500">Follow-up</h3>
              <div
                dangerouslySetInnerHTML={{
                  __html: minutes.followUp.replace(/\n/g, "<br/>"),
                }}
              />
            </div>
          )}

          <div className="mt-6 pt-4 border-t border-gray-200">
            <button className="flex items-center justify-center py-2 px-4 bg-success hover:bg-success-dark text-white font-medium rounded-md transition-colors focus:outline-none focus:ring-2 focus:ring-success-light">
              <FaSave className="mr-2" />
              Save Minutes
            </button>
          </div>
        </div>
      )}

      {transcription && !loading && (
        <div className="mt-4 p-4 bg-gray-50 rounded-lg">
          <h3 className="font-medium mb-2">Transcript</h3>
          <div className="max-h-64 overflow-y-auto text-sm text-gray-600">
            {transcription}
          </div>
        </div>
      )}
    </div>
  );
};

export default MinutesGenerator;
