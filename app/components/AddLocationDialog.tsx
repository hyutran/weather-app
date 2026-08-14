"use client";

import { useState, type FormEvent } from "react";
import { PlusIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Combobox,
  ComboboxCollection,
  ComboboxContent,
  ComboboxEmpty,
  ComboboxInput,
  ComboboxItem,
  ComboboxList,
} from "@/components/ui/combobox";
import { locations, type Location } from "@/data/locations";

interface AddLocationDialogProps {
  existingSlugs: string[];
  onAdd: (location: Location) => void;
}

// Dialog for searching and adding a new location to the tracked list.
export function AddLocationDialog({ existingSlugs, onAdd }: AddLocationDialogProps) {
  const [open, setOpen] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState<Location | null>(null);

  const availableLocations = locations.filter(
    (location) => !existingSlugs.includes(location.slug)
  );

  // Resets the selected location whenever the dialog closes.
  function handleOpenChange(nextOpen: boolean) {
    setOpen(nextOpen);
    if (!nextOpen) {
      setSelectedLocation(null);
    }
  }

  // Adds the selected location and closes the dialog.
  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!selectedLocation) {
      return;
    }

    onAdd(selectedLocation);
    setSelectedLocation(null);
    setOpen(false);
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger className="flex h-full min-h-26 w-full items-center justify-center gap-3 rounded-4xl px-5 py-6 text-foreground/80 shadow-lg shadow-black/10 outline outline-dashed -outline-offset-1 bg-card/40 outline-white/20 transition-colors hover:outline-white/40 hover:text-foreground sm:px-6 xl:px-7">
        <PlusIcon className="size-4" />
        <span className="text-sm font-medium">Add location</span>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add a location</DialogTitle>
          <DialogDescription>
            Search for a location to add it to your list.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <Combobox
            items={availableLocations}
            value={selectedLocation}
            onValueChange={setSelectedLocation}
            itemToStringLabel={(location) => location?.name ?? ""}
          >
            <ComboboxInput placeholder="Search locations..." />
            <ComboboxContent>
              <ComboboxEmpty>No location found.</ComboboxEmpty>
              <ComboboxList>
                <ComboboxCollection>
                  {(location: Location) => (
                    <ComboboxItem key={location.slug} value={location}>
                      {location.name}
                    </ComboboxItem>
                  )}
                </ComboboxCollection>
              </ComboboxList>
            </ComboboxContent>
          </Combobox>
          <DialogFooter>
            <Button type="submit" disabled={!selectedLocation}>
              Add location
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
