'use client';

import { Fragment } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { XMarkIcon } from '@heroicons/react/24/outline';
import { FilterOption } from '@/types';

interface FilterModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  options: FilterOption[];
}

export default function FilterModal({ isOpen, onClose, title, options }: FilterModalProps) {
  return (
    <Transition show={isOpen} as={Fragment}>
      <Dialog onClose={onClose} className="relative z-50">
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black/80" />
        </Transition.Child>

        <div className="fixed inset-0 overflow-y-auto">
          <div className="min-h-full">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 translate-y-4"
              enterTo="opacity-100 translate-y-0"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 translate-y-0"
              leaveTo="opacity-0 translate-y-4"
            >
              <Dialog.Panel className="w-full min-h-full bg-gaming-dark transform text-left text-white">
                <div className="sticky top-0 z-10 flex items-center justify-between px-4 py-3 bg-gaming-dark border-b border-white/10">
                  <Dialog.Title className="text-lg font-medium">
                    {title}
                  </Dialog.Title>
                  <button
                    onClick={onClose}
                    className="p-1 rounded-full hover:bg-white/10"
                  >
                    <XMarkIcon className="w-6 h-6" />
                  </button>
                </div>

                <div className="p-4">
                  <div className="space-y-2">
                    {options.map((option) => (
                      <button
                        key={option.id}
                        className="w-full flex items-center px-4 py-3 rounded-lg bg-gaming-dark-card hover:bg-gaming-dark-card/80 transition-colors"
                      >
                        <span className="flex-1 text-left">{option.label}</span>
                      </button>
                    ))}
                  </div>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
} 