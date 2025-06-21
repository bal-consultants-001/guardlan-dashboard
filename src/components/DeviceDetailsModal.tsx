'use client';

import React, { useState } from 'react';
import { DeviceWithLog, DeviceList, DeviceGroup, DeviceClient } from '@/types';

interface DeviceDetailsModalProps {
  device: DeviceWithLog;
  data: {
    lists: DeviceList[];
    groups: DeviceGroup[];
    clients: DeviceClient[];
  };
  onClose: () => void;
}

const DeviceDetailsModal: React.FC<DeviceDetailsModalProps> = ({ device, data, onClose }) => {
  const [listsState, setListsState] = useState<DeviceList[]>(data.lists);
  const [clientsState, setClientsState] = useState<DeviceClient[]>(data.clients);

  if (!device) return null;

  const handleListToggle = (listIndex: number, groupId: number) => {
    const newLists = [...listsState];
    const groupList = newLists[listIndex].groups ?? [];

    const isChecked = groupList.includes(groupId);
    newLists[listIndex].groups = isChecked
      ? groupList.filter((id) => id !== groupId)
      : [...groupList, groupId];

    setListsState(newLists);

    // TODO: Call Supabase update here if needed
  };

  const handleClientToggle = (clientIndex: number, groupId: number) => {
    const newClients = [...clientsState];
    const groupList = newClients[clientIndex].groups ?? [];

    const isChecked = groupList.includes(groupId);
    newClients[clientIndex].groups = isChecked
      ? groupList.filter((id) => id !== groupId)
      : [...groupList, groupId];

    setClientsState(newClients);

    // TODO: Call Supabase update here if needed
  };

  return (
    <div className="fixed inset-0 bg-black/30 backdrop-blur-sm text-black flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg w-full max-w-6xl max-h-[90vh] overflow-y-auto shadow-lg">
        <h2 className="text-2xl font-bold mb-6">Device Details: {device.Hostname}</h2>

        {/* Lists Section */}
        <div className="mb-6">
          <h3 className="text-lg font-semibold mb-2">Lists (Assign via Groups)</h3>
          <table className="w-full border border-gray-300 text-sm">
            <thead className="bg-gray-100">
              <tr>
                <th className="border px-4 py-2 text-left">Comment</th>
                <th className="border px-4 py-2 text-left">Type</th>
                {data.groups.map((group) => (
                  <th key={group.pi_id} className="border px-2 py-2 text-center">
                    {group.name}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {listsState.map((list, listIdx) => (
                <tr key={listIdx}>
                  <td className="border px-4 py-2">{list.comment || '—'}</td>
                  <td className="border px-4 py-2">{list.type || '—'}</td>
                  {data.groups.map((group) => (
                    <td key={group.pi_id} className="border px-2 py-2 text-center">
                      <input
                        type="checkbox"
                        checked={list.groups?.includes(group.pi_id) || false}
                        onChange={() => handleListToggle(listIdx, group.pi_id)}
                      />
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Clients Section */}
        <div className="mb-6">
          <h3 className="text-lg font-semibold mb-2">Clients (Assign via Groups)</h3>
          <table className="w-full border border-gray-300 text-sm">
            <thead className="bg-gray-100">
              <tr>
                <th className="border px-4 py-2 text-left">Name</th>
                <th className="border px-4 py-2 text-left">Client</th>
                {data.groups.map((group) => (
                  <th key={group.pi_id} className="border px-2 py-2 text-center">
                    {group.name}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {clientsState.map((client, clientIdx) => (
                <tr key={clientIdx}>
                  <td className="border px-4 py-2">{client.name || '—'}</td>
                  <td className="border px-4 py-2">{client.client || '—'}</td>
                  {data.groups.map((group) => (
                    <td key={group.pi_id} className="border px-2 py-2 text-center">
                      <input
                        type="checkbox"
                        checked={client.groups?.includes(group.pi_id) || false}
                        onChange={() => handleClientToggle(clientIdx, group.pi_id)}
                      />
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Close Button */}
        <div className="text-right">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-700 text-white rounded hover:bg-gray-900"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeviceDetailsModal;
