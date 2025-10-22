import { useEffect, useState } from "react";

interface GoogleDoc {
  id: string;
  name: string;
  webViewLink: string;
}

export default function Docs() {
  const [docs, setDocs] = useState<GoogleDoc[]>([]);
  const [selectedDoc, setSelectedDoc] = useState<GoogleDoc | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const apiBase = import.meta.env.VITE_API_BASE_URL;

  useEffect(() => {
    const fetchDocs = async () => {
      try {
        const res = await fetch(`${apiBase}/google/docs/list`);
        if (!res.ok) {
          if (res.status === 401) {
            throw new Error("Not authorized. Please connect your Google account.");
          }
          throw new Error("Failed to fetch documents");
        }
        const data = await res.json();
        setDocs(data.files || []);
        if (data.files && data.files.length > 0) {
          setSelectedDoc(data.files[0]);
        }
      } catch (err: any) {
        console.error("Error fetching docs:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchDocs();
  }, [apiBase]);

  if (loading) return <div className="p-6">Loading documents...</div>;
  if (error)
    return (
      <div className="p-6 text-red-600">
        ⚠️ {error}. <br />
        <a
          href={`${apiBase}/google/auth`}
          className="text-blue-600 underline"
        >
          Connect your Google account
        </a>
      </div>
    );

  return (
    <div className="flex h-full">
      {/* Left panel */}
      <div className="w-1/4 border-r bg-white p-4">
        <div className="flex justify-between items-center mb-4">
          <h2 className="font-semibold text-lg">My Documents</h2>
          <button
            className="bg-blue-600 text-white px-3 py-1 rounded text-sm"
            onClick={async () => {
                        try {
                            const res = await fetch(`${apiBase}/google/docs/create`, { method: "POST" });
                            if (res.status === 401) {
                            // Token missing or expired → reconnect
                            window.location.href = `${apiBase}/google/auth`;
                            return;
                            }
                            if (!res.ok) throw new Error("Failed to create document");

                            const newDoc = await res.json();

                            // Add the new document at the top of the list
                            setDocs((prev) => [newDoc, ...prev]);
                            setSelectedDoc(newDoc);
                        } catch (err) {
                            console.error("Error creating doc:", err);
                            alert("Something went wrong while creating a document.");
                        }
                    }
                }
         >+ New
          </button>
        </div>
        <ul>
          {docs.map((doc) => (
            <li
              key={doc.id}
              className={`p-2 cursor-pointer rounded ${
                selectedDoc?.id === doc.id ? "bg-blue-100" : "hover:bg-gray-100"
              }`}
              onClick={() => setSelectedDoc(doc)}
            >
              {doc.name}
            </li>
          ))}
        </ul>
      </div>

      {/* Right panel */}
      <div className="flex-1 bg-gray-50">
        {selectedDoc ? (
          <iframe
            src={selectedDoc.webViewLink}
            title={selectedDoc.name}
            className="w-full h-screen border-none"
          ></iframe>
        ) : (
          <div className="h-full flex items-center justify-center text-gray-500">
            Select a document to open
          </div>
        )}
      </div>
    </div>
  );
}
