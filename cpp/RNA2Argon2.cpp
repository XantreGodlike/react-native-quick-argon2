#include "RNA2Argon2.h"

namespace rnargon2 {

static argon2_context make_context(uint8_t *buf, ustring &plain, ustring &salt,
                                   Options &opts) {
    argon2_context ctx;

    ctx.out = buf;
    ctx.outlen = opts.hash_length;
    ctx.pwd = plain.data();
    ctx.pwdlen = plain.size();
    ctx.salt = salt.data();
    ctx.saltlen = salt.size();
    ctx.secret = opts.secret.empty() ? nullptr : opts.secret.data();
    ctx.secretlen = opts.secret.size();
    ctx.ad = opts.ad.empty() ? nullptr : opts.ad.data();
    ctx.adlen = opts.ad.size();
    ctx.t_cost = opts.time_cost;
    ctx.m_cost = opts.memory_cost;
    ctx.lanes = opts.parallelism;
    ctx.threads = opts.parallelism;
    ctx.allocate_cbk = nullptr;
    ctx.free_cbk = nullptr;
    ctx.flags = ARGON2_FLAG_CLEAR_PASSWORD | ARGON2_FLAG_CLEAR_SECRET;
    ctx.version = opts.version;

    return ctx;
}

}  // namespace rnargon2
