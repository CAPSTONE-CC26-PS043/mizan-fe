import { AlertTriangle } from "lucide-react";
import { 
      Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription
 } from '@/components/ui/shadcn/dialog'
 import { Button } from "@/components/ui/shadcn/button";
 import { Budget } from "@/types/budget.types";


 interface BUdgetDeleteDialogProps {
      isOpen: boolean;
      onOpenChange: (open: boolean) => void;
      activeBudget: Budget | null;
      onConfirm: () => void;
 }

 function formatRupiah(value: number): string {
      return new Intl.NumberFormat('id-ID' , {
            style: 'currency',
            currency: 'IDR',
            minimumFractionDigits: 0,
      }).format(value);
 }

 export function BudgetDeleteDialog ({
      isOpen,
      onOpenChange,
      activeBudget,
      onConfirm,
 }: BUdgetDeleteDialogProps) {
      return (
            <Dialog open={isOpen} onOpenChange={onOpenChange}>
                  <DialogContent className="sm:max-w-sm rounded -2xl">
                        <DialogHeader>
                              <DialogTitle className="text-s1 font-semibold">Delete Budget?</DialogTitle>
                              <DialogDescription className="sr-only">Confirm deletion</DialogDescription>
                        </DialogHeader>

                        <div className="py-2 space-y-4">
                              {/* Warning*/}
                              <div className="flex justify-center">
                                    <div className="w-14 h-14 rounded-2xl bg-red-50 flex items-center justify-center">
                                          <AlertTriangle className="w-7 h-7 text-red-500"></AlertTriangle>
                                    </div>
                              </div>

                              {/* Budget Infor*/}
                              {activeBudget && (
                                    <div className="text-center space-y-1">
                                          <p className="text-sm text-muted-foreground">
                                                You're about to delete {' '}
                                                <span className="font-semibold text-foreground">"{activeBudget.name}"</span>
                                          </p>
                                          <p className="text-sm text-muted-foreground">
                                                Allocated: {' '}
                                                <span className="font-medium text-foreground">
                                                      {formatRupiah(activeBudget.allocated)}
                                                </span>
                                          </p>

                                          {/* Warning if budget  has remaining */}
                                          {activeBudget.spent < activeBudget.allocated && (
                                                <div className="mt-3 p-3 bg-orange-50 border border-orange-200 rounded-xl text-sm text-orange-700">
                                                      This budget still has {' '}
                                                      <span className="font-semibold">
                                                            {formatRupiah(activeBudget.allocated - activeBudget.spent)}
                                                      </span>{' '}
                                                      remaining.
                                                </div>
                                          )}
                                    </div>
                              )}

                              {/* Note Data History */}
                              <p className="text-xs text-center text-muted-foreground">
                                    Historical data will be kept. This action only removes the budget plan.
                              </p>
                        </div>

                        <DialogFooter className="gap-2">
                              <Button variant="outline" onClick={() => onOpenChange(false)} className="flex-1 rounded-xl">
                                    Cancel
                              </Button>
                              <Button onClick={onConfirm} className="flex-1 bg-red-500 hover:bg-red-600 text-white rounder-xl"
                              >
                                    Delete
                              </Button>
                        </DialogFooter>
                  </DialogContent>
            </Dialog>
      )
 }


