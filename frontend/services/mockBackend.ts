// Mocks removed: this file used to contain the local mock backend implementation.
// The project has migrated to use the real backend endpoints. To avoid
// runtime import errors from lingering imports, this stub exports the
// previously used function names but each will throw a descriptive error
// indicating that mocks were removed.

export const mockLogin = async (): Promise<any> => { throw new Error('MOCKS_REMOVED'); };
export const mockRegister = async (): Promise<any> => { throw new Error('MOCKS_REMOVED'); };
export const mockUpdateUser = async (): Promise<any> => { throw new Error('MOCKS_REMOVED'); };
export const mockLogout = (): void => { throw new Error('MOCKS_REMOVED'); };
export const getCurrentUser = (): any => { throw new Error('MOCKS_REMOVED'); };
export const getSessions = async (): Promise<any[]> => { return []; };
export const saveSession = async (): Promise<void> => { throw new Error('MOCKS_REMOVED'); };
export const toggleFavoriteSession = async (): Promise<void> => { throw new Error('MOCKS_REMOVED'); };
export const deleteSession = async (): Promise<void> => { throw new Error('MOCKS_REMOVED'); };
export const mockUploadFile = async (): Promise<any> => { throw new Error('MOCKS_REMOVED'); };
export const getUploadedFiles = async (): Promise<any[]> => { return []; };
export const getEmotionStats = async (): Promise<any[]> => { return []; };
export const getDailyContent = async (): Promise<any> => { throw new Error('MOCKS_REMOVED'); };
export const getVoiceSample = async (): Promise<string> => { throw new Error('MOCKS_REMOVED'); };
