export type TicketFetchArgs = {
  siteIds?: number[];
  truckIds?: number[];
  dateRange?: {
    start: Date;
    end: Date;
  };
};
