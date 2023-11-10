import beaker as bk
import pyteal as pt

class MyState:
    counter = bk.GlobalStateValue(pt.TealType.uint64)

    # 1. Add local state
    local_counter = bk.LocalStateValue(
        stack_type=pt.TealType.uint64,
        default=pt.Int(0),
        descr="An int stored for each account that opts in",
    )

# 2. Update App Name
app = bk.Application("Modified Counter", state=MyState())

# 3. Add optin method
@app.opt_in
def opt_in() -> pt.Expr:
    return app.initialize_local_state()

# 4. rename add and deduct to add_global and deduct_global
@app.external
def add(*, output: pt.abi.Uint64) -> pt.Expr:
    current_counter = app.state.counter
    result = current_counter + pt.Int(1)
    return pt.Seq(
        app.state.counter.set(result),
        output.set(current_counter)
    )

@app.external
def deduct(*, output: pt.abi.Uint64) -> pt.Expr:
    current_counter = app.state.counter
    result = current_counter - pt.Int(1)
    return pt.Seq(
        app.state.counter.set(result),
        output.set(current_counter)
    )

# 5. create a local version of add and deduct
@app.external
def add_local() -> pt.Expr:
    return app.state.local_counter.increment(pt.Int(1))

@app.external
def deduct_local() -> pt.Expr:
    return app.state.local_counter.decrement(pt.Int(1))


@app.external(read_only=True)
def read_counter(*, output: pt.abi.Uint64) -> pt.Expr:
    return output.set(app.state.counter)

if __name__ == "__main__":
    spec = app.build()
    spec.export("artifacts")