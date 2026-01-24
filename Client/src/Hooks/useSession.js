import { useQuery, useMutation } from "@tanstack/react-query";
import toast from 'react-hot-toast'
import { sessionApi } from "../api/sessions";



export const useCreateSession = () => {
    const result = useMutation({
        mutationKey: ["createSession"],
        mutationFn: sessionApi.createSession,
        onSuccess: () => toast.success("Session created sucessfully"),
        onError: (error) => toast.error(error.response?.data?.message || "Failed to create Session")
    });
    return result;

};

export const useActiveSessions = () => {
    const result = useQuery({     //data,error, isLoading, isFetching, isEnabled, refatch
        queryKey: ["activeSessions"],
        queryFn: sessionApi.getActiveSession
    });

    return result;
};

export const useMyRecentSessions = () => {
    const result = useQuery({     //data,error, isLoading, isFetching, isEnabled, refatch
        queryKey: ["myRecentSessions"],
        queryFn: sessionApi.getMyRecentSession
    });

    return result;
};


export const useSessionById = (id) => {
    const result = useQuery({     //data,error, isLoading, isFetching, isEnabled, refatch
        queryKey: ["session", id],
        queryFn: () => sessionApi.getSessionById(id),
        enabled: !!id,
        refetchInterval: 5000, // 5s to detect session status change
    });

    return result;
};


export const useJoinSession = (id) => {
    return useMutation({
        mutationKey: ["joinSession"],
        mutationFn: () => sessionApi.joinSession(id),
        onSuccess: () => toast.success("Session joined"),
        onError: (error) => toast.error(error.response?.data?.message || "Failed to join Session"),

    });
}

export const useEndSession = (id) => {
    return useMutation({
        mutationKey: ["endSession"],
        mutationFn: () => sessionApi.endSession(id),
        onSuccess: () => toast.success("Session Ended"),
        onError: (error) => toast.error(error.response?.data?.message || "Failed to end Session"),

    });
}

export const useUpdateSessionProblem = (id) => {
    return useMutation({
        mutationKey: ["updateSessionProblem", id],
        mutationFn: ({ problem, difficulty }) => sessionApi.updateSessionProblem({ id, problem, difficulty }),
        onSuccess: () => toast.success("Problem updated"),
        onError: (error) => toast.error(error.response?.data?.message || "Failed to update problem"),
    });
}
