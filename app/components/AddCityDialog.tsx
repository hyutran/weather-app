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
import { cities, type City } from "@/data/cities";

interface AddCityDialogProps {
  existingSlugs: string[];
  onAdd: (city: City) => void;
}

export function AddCityDialog({ existingSlugs, onAdd }: AddCityDialogProps) {
  const [open, setOpen] = useState(false);
  const [selectedCity, setSelectedCity] = useState<City | null>(null);

  const availableCities = cities.filter(
    (city) => !existingSlugs.includes(city.slug)
  );

  function handleOpenChange(nextOpen: boolean) {
    setOpen(nextOpen);
    if (!nextOpen) {
      setSelectedCity(null);
    }
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!selectedCity) {
      return;
    }

    onAdd(selectedCity);
    setSelectedCity(null);
    setOpen(false);
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger className="flex h-full min-h-24 w-full items-center justify-center gap-3 rounded-2xl px-5 py-6 text-foreground/70 shadow-lg shadow-black/10 outline outline-dashed -outline-offset-1 bg-white/10 outline-white/20 transition-colors hover:outline-white/40 hover:text-foreground sm:px-6 xl:px-7">
        <PlusIcon className="size-4" />
        <span className="text-sm font-medium">Add city</span>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add a city</DialogTitle>
          <DialogDescription>
            Search for a city to add it to your list.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <Combobox
            items={availableCities}
            value={selectedCity}
            onValueChange={setSelectedCity}
            itemToStringLabel={(city) => city?.name ?? ""}
          >
            <ComboboxInput placeholder="Search cities..." />
            <ComboboxContent>
              <ComboboxEmpty>No city found.</ComboboxEmpty>
              <ComboboxList>
                <ComboboxCollection>
                  {(city: City) => (
                    <ComboboxItem key={city.slug} value={city}>
                      {city.name}
                    </ComboboxItem>
                  )}
                </ComboboxCollection>
              </ComboboxList>
            </ComboboxContent>
          </Combobox>
          <DialogFooter>
            <Button type="submit" disabled={!selectedCity}>
              Add city
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
