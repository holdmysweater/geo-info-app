import { PaginationService } from './pagination.service';

describe('PaginationService', () => {
  let service: PaginationService;

  beforeEach(() => {
    service = new PaginationService();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should set current page', () => {
    service.setCurrentPage(2);
    expect(service.currentPage()).toBe(2);
  });

  it('should not set current page to negative number', () => {
    service.setCurrentPage(-1);
    expect(service.currentPage()).toBe(0);
  });

  it('should set total pages', () => {
    service.setTotalPages(5);
    expect(service.totalPages()).toBe(5);
  });

  it('should not set total pages to negative number', () => {
    service.setTotalPages(-1);
    expect(service.totalPages()).toBe(0);
  });

  it('should decrease current page if it exceeds total pages after setTotalPages', () => {
    service.setCurrentPage(4);
    service.setTotalPages(3);
    expect(service.currentPage()).toBe(2); // totalPages - 1
  });
});
